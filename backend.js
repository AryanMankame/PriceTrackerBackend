const express = require('express');
const knex = require('knex');
const {spawn} = require('child_process');
const {func} = require('./Test');
const {fetchFunction,shorten,whichWebsite} = require("./url_shortner");
const Nightmare = require('nightmare')
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
const DATABASE_URL = "postgres://efcaieryykbrfc:0b394af4b6f31edb8fdbdb356c88c2cd874a4a51b341bb0b38f67819301d81d2@ec2-107-22-245-82.compute-1.amazonaws.com:5432/da8rf42fe8tsi1"
const database = knex({
    client: 'pg',
    connection: {
      connectionString : DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  });
app.get('/', (req, res) => {
  res.send('Done the job');
});
app.get('/info/:email', (req, res) => {
  let email = req.params.email;
  console.log(req.params.email);
  res.send(req.params);
})
app.post('/signup', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  database('login').where({
    email:email
  }).select('*').then(data => {
    res.json(data[0]);
  }).catch(err => {res.json('not found'); console.log('Pls try again => ',err)});
  console.log(password,email);
})
app.post('/register',(req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  console.log('Register page');
  if(name === '' || email === '' || password === '') {
      res.json('Invalid input');
      return 2;
  }
  console.log(name,'=>',email,'=>',password);
  database('register').where({
    email:email,
    password:password,
  }).then((data) => {
      if(data.length === 0){
      console.log('data ->',data);
      database('register').insert({
        email:email,
        password:password,
        name:name
      }).then(response => {console.log('data added to register' + response)});
      database('login').insert({
        email:email,
        password:password,
      }).then(response => {res.json('Successful')}).catch(err => console.log('error faced',err));
    }
    else{
      console.log('already exists')
      console.log(data);
      res.json('the user already exists');
    }
  })
  .catch(err => {
    console.log('error found => ', err);
  });
})
app.post('/data',(req,res) => {
  let url = req.body.url;
  let price = req.body.price;
  console.log('price =>',url);
  let data1;
  let pythonCode = spawn('python',['Price_Scrapping.py',url]);
  pythonCode.stdout.on('data',(data) => {
    data1 = data.toString();
  });
  pythonCode.on('close',(data) => {
    console.log('data1 => ',data1);
    res.json(data1);
  })
})
app.post('/frontend',(req, res) => {
  let email = req.body.email;
  console.log('email on frontend => ',email);
  let info = [];
  let prom = [];
  let promR = [];
  database('userinfo').where({
    email:email
  }).select('*').then(data => {
  let l = data.length;
  for(let i=0;i<l;i++){
      prom = [...prom,new Promise((resolve, reject) => {
      promR = [...promR,resolve];
      })];
      let item = data[i];
      let website = whichWebsite(item.url);
      let data1;
      if(website === "flipkart"){
      let pythonCode = spawn('python',['Price_Scrapping.py',item.url]);
        pythonCode.stdout.on('data',(data) => {
        data1 = data.toString().split()[0];
        console.log(data1);
        let ans = [];
        let a = '';
        for(let i=0 ; i < data1.length; i++) {
          if(data1[i] === '\r'){
              ans = [...ans,a]
              a = ''
          }
          else if(data1[i] === '[' || data1[i] === ']' || data1[i] === '\n') continue;
          else a += data1[i];
      }
      ans = [...ans,item.price];
      ans = [...ans,item.url];
      info = [...info,ans];
      // if(info.length === l){
      //   console.log('length ==>',info.length,l);
      //   res.json(info);
      // }
      promR[i](2);
      });
      // pythonCode.on('close',(data) => {
      //   if(info.length === l){
      //   // res.json(info);
      //   }
      // })
    }
    else if(website === "amazon"){
      let ans = item.price;
      const nightmare = Nightmare({ show: true })
      .goto(item.url)
      .wait('.a-price')
      .evaluate(() => {
    return [document.getElementsByClassName("a-price")[0].innerText,document.getElementById('imgBlkFront').src,document.getElementById('productTitle').innerText];
  })
  .end()
  .then(data => {
    data[0] = data[0].substring(1,data[0].length/2);
    data = [...data,ans]; data = [...data,item.url]; info = [...info,data]; console.log(info); 
    promR[i](1);
  })
  .catch(error => {
    console.error('Search failed:', error)
  })
    }
    if(i === l-1){
      console.log(prom.length,promR.length);
      Promise.allSettled(prom).then(() => {res.json(info); console.log("final = >>> ",info)});
    }
    }
  }).catch(err => {res.json('not found'); console.log('Pls try again => ',err)});
});
app.post('/trackinbackend',async (req, res) => {
  let email = req.body.email;
  let url = req.body.url;
  let phone = req.body.phone;
  let price = req.body.price;
  url = shorten(url);
  website = whichWebsite(url);
  console.log(email,url,phone,website);
  database('userinfo').insert({
    email: email,
    url: url,
    price:price
  }).then(response => console.log('done inserting'));
  func(url,email,website);
  res.json('Thanks it worked');
});
app.listen(4000);