const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'admin',
    database : 'predict-app'
  }
});

// knex.select("").from("users").then(data => console.log(data));

app.use(express.json());
app.use(cors());

const PORT = 3001;


app.get("/", (req, res) => {
  res.status(200).send(knex.users);
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  const saltRounds = 10;
  // let hash = bcrypt.hash(password);

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
     return knex.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into("login")
        .returning("email")
        .then(loginEmail => {
          return trx("users").returning("*").insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          }).then(user => {
            res.json(user[0]);
          })
          // .catch(err => res.status(400).json("You cannot register now! Please try again later!"))
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })

    })
  })

  
});

app.post("/signin", (req, res) => {

 return knex.select('email', 'hash').from("login")
  .where("email", "=", req.body.email)
  .then(data => {
      bcrypt.compare(req.body.password, data[0].hash, function(err, results) {
        if(results) {
          return knex.select("*").from("users")
           .where("email", "=", req.body.email)
           .then(user => {
             res.json(user[0])
     
           })
           .catch(err => res.status(400).json("Unable to get user..."))
         } else {
           res.status(400).json("Wrong username or password")
         }
      });
  })
  .catch(err => res.status(400).json("There it is a problem. Try again later..."))
});


app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  knex.select("*").from("users").where({
    id: id
  }).then(user => {
    if(user.length){
      res.json(user[0])
    } else {
      res.status(400).json("User not found!!")
    }
  }).catch(err => {
    res.status(400).json("There is an error! Please try again later")
  })

 
});

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});

// /signin route --> POST -> succes || fail
// /register --> POST -> return new user created
// /profile/:userdId --> GET -> return user
