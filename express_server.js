const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const {
  generateRandomString,
  emailLookup
} = require('./helpers/userHelpers');
const {
  urlDatabase,
  usersDB
} = require('./data/userData');

app.set("view engine", "ejs");
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const userID = req.cookies["userID"];
  const templateVars = {
    urls: urlDatabase,
    user: usersDB[userID]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.cookies["userID"];
  const templateVars = {
    urls: urlDatabase,
    user: usersDB[userID]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies["userID"];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: usersDB[userID]
  };

  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;

  res.redirect(`/urls/${shortURL}`);
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];

  res.redirect("/urls");
});

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.newURL;

  res.redirect("/urls");
});

app.post('/urls/:shortURL/edit', (req, res) => {
  console.log(req.params.shortURL);
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/login', (req, res) => {
  const {
    email
  } = req.body;
  res.cookie("userID", email);
  res.cookie("isAuthenticated", true);
  return res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.clearCookie("isAuthenticated");

  return res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const userID = req.cookies["userID"];
  const templateVars = {
    urls: urlDatabase,
    user: usersDB[userID]
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  // Get the information from the body of the request
  const {
    email,
    password
  } = req.body;

  console.log(usersDB);
  if (email && password) {
    if (emailLookup(usersDB, email) === true) {
      const userID = generateRandomString();
      usersDB[userID] = {
        id: userID,
        email,
        password
      };
      res.cookie("userID", userID);
      res.redirect("/urls");
      return;
    } else {
      return res.sendStatus(400);
    }
  } else {
    return res.sendStatus(400);
  }
});