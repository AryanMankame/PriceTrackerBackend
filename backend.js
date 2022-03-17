const express = require('express');
const knex = require('knex');
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
const database = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl:true,
    }
  });
app.get('/', (req, res) => {
  res.send('Done the job');
});
app.post('/signup', (req, res) => {
  let password = req.body.password;
  let email = req.body.email;
  database('login').where({
    email:email
  }).select('*').then(data => {
    console.log(data[0].id);
    res.json(data[0]);
  }).catch(err => {res.json('not found'); console.log('Pls try again => ',err)});
  console.log(password,email);
})
app.post('/register',(req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  if(name === '' || email === '' || password === '') {
      res.json('Invalid input');
      return 2;
  }
  console.log(name,'=>',email,'=>',password);
  database.transact(trx => {
      trx.insert({
        name:NamedNodeMap,
        email:email,
        password:password,
      })
      .into('register')
      .returning('email')
      .then(loginEmail => {
        return trx('login')
        .returning('*')
        .insert({
          email: email,
          password:password
        })
        .then(user => res.json(user[0]))
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => console.log('unable to register'));
  });
  // database('register').where({
  //   email:email,
  //   Password:password,
  // }).then((data) => {
  //     if(data.length === 0){
  //     console.log('data ->',data);
  //     database('register').insert({
  //       email:email,
  //       Password:password,
  //       name:name
  //     }).then(response => {console.log('data added to register' + response)});
  //     database('login').insert({
  //       email:email,
  //       Password:password,
  //     }).then(response => {res.json('Successful')}).catch(err => console.log('error faced',err));
  //   }
  //   else{
  //     console.log('already exists')
  //     console.log(data);
  //     res.json('the user already exists');
  //   }
  // })
  // .catch(err => {
  //   console.log('error found => ', err);
  // });
})
app.listen(process.env.PORT || 4000);