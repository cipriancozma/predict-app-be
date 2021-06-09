const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

const db = {
  users: [
    {
      id: "1",
      name: "Andrei",
      email: "cozma_ciprian19@yahoo.com",
      password: "12345",
    },
    {
      id: "2",
      name: "Cozma",
      email: "ciprian.ciprian@email.com",
      password: "12455",
    },
  ],
};

app.get("/", (req, res) => {
  res.status(200).send(db.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === db.users[0].email &&
    req.body.password === db.users[0].password
  ) {
    res.status(200).json(db.users[0]);
  } else {
    res.status(400).json("Error!!");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db.users.push({
    id: "444",
    name: name,
    email: email,
    password: password,
  });
  res.json(db.users[db.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;

  db.users.map((user) => {
    if (user.id === id) {
      found = true;
      return res.status(200).json(user);
    }
  });

  if (!found) {
    res.status(404).json("We don't have such an user");
  }
});

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`);
});

// /signin route --> POST -> succes || fail
// /register --> POST -> return new user created
// /profile/:userdId --> GET -> return user
