const {spawn} = require('child_process');
const nodemailer = require("nodemailer");
const Vonage = require('@vonage/server-sdk');
const Nightmare = require('nightmare')
const {fetchFunction} = require('./url_shortner')
const vonage = new Vonage({
  apiKey: "c4284fcc",
  apiSecret: "PRNAwCNbf6ff5HOZ"
})
let transporter = nodemailer.createTransport({
    service:"gmail", // true for 465, false for other ports
    auth: {
      user: 'temporaryemail2012000@gmail.com', // generated ethereal user
      pass: 'Temporaryemail@20/1/2000', // generated ethereal password
    },
  });
let f;
const knex = require('knex');
const DATABASE_URL = "postgres://efcaieryykbrfc:0b394af4b6f31edb8fdbdb356c88c2cd874a4a51b341bb0b38f67819301d81d2@ec2-107-22-245-82.compute-1.amazonaws.com:5432/da8rf42fe8tsi1"
const database = knex({
    client: 'pg',
    connection: {
      connectionString : DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  });
let t = 0;
const func = async (url,email,website)=> {
    f = setInterval(()=>{
        database('userinfo').where({
            email,
            url}).select('price').then(data => {
           let finalprice = (data[0].price);
           let data1;
           let pythonCode;
           if(website == "flipkart"){
           pythonCode = spawn('python',['PriceScapeBackend.py',url]);
           pythonCode.stdout.on('data',(data) => {
           data1 = Number(data.toString());
           });
          }
          else if(website == "amazon"){
            if(t === 0){
            console.log("I am running properly");
            const nightmare = Nightmare({ show: true });
            nightmare
            .goto(url)
            .wait('#price')
            .end()
            .evaluate(() => document.getElementById('price').innerText)
            .then(data => {
              data1 = data;
              let no = data1.substring(1);
              console.log("no => ",no);
              data1 = parseFloat(no);
              console.log("data1=> ",data1);
              t = -1;
              if(data1 <= finalprice){
                console.log('The limit bound has been reached');
                clearInterval(f);
                   transporter.sendMail({
                      from: 'temporaryemail2012000@gmail.com', // sender address
                      to: email, // list of receivers
                      subject: "BUY! BUY! BUY!", // Subject line
                      text: "Go to the url and buy it => " + url, // plain text body
                      // html: "<b>Hello world?</b>", // html body
                  }).then(res => console.log('done sending')).catch(err => console.log('err => ',err));
                //  i need to increase my typing speed if i want to enjoy the world of development which requires a lot of typing thus required you to comparativetly type fast than anyone else which will help me in future when it comes to quick implementation of the idea you wanted to implement
              }
            })
            .catch(error => {
              console.error('Search failed:', error);
            })
          } t++;
            console.log(t);
            pythonCode = spawn('python',['test.py']);
          }
          pythonCode.on('close',async (data) => {
               if(data1 <= finalprice){
                   clearInterval(f);
                   transporter.sendMail({
                      from: 'temporaryemail2012000@gmail.com', // sender address
                      to: email, // list of receivers
                      subject: "BUY! BUY! BUY!", // Subject line
                      text: "Go to the url and buy it => " + url, // plain text body
                      // html: "<b>Hello world?</b>", // html body
                  }).then(res => console.log('done sending')).catch(err => console.log('err => '));
                  }
                })
              }).catch(err => console.log('error = >'));
            },10*1000);
}
module.exports = {func};