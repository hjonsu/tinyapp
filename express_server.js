const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

const {
  generateRandomString,
  emailExists,
  userIdOfEmail,
  urlsForUser,
  inUserDb,
  ownUrl,
} = require("./helpers/userHelpers");
const { urlDatabase, usersDB } = require("./data/userData");

app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["secret keys"],
  })
);

app.get("/", (req, res) => {
  const userID = req.session.userID;
  if (!inUserDb(usersDB, userID)) {
    res.redirect("/login");
    return;
  }
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  const templateVars = {
    urls: urlsForUser(urlDatabase, userID),
    user: usersDB[userID],
  };
  if (!inUserDb(usersDB, userID)) {
    res.redirect("/login");
    return;
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  const templateVars = {
    urls: urlDatabase,
    user: usersDB[userID],
  };
  if (!inUserDb(usersDB, userID)) {
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const shortURL = req.params.shortURL;
  if (!inUserDb(usersDB, userID)) {
    res.redirect("/login");
    return;
  }
  if (!ownUrl(userID, urlDatabase, shortURL)) {
    res.status(403).send("This is not your url!");
    return;
  }
  const user = usersDB[userID];
  const originalUser = urlDatabase[req.params.shortURL].userID;
  const templateVars = {
    shortURL,
    longURL,
    user,
    userID,
    originalUser,
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const userID = req.session.userID;
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  if (!inUserDb(usersDB, userID)) {
    res.redirect("/login");
    return;
  }
  urlDatabase[shortURL] = {
    longURL,
    userID,
  };

  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // if (longURL.includes('http://', 0)) {
  res.redirect(longURL);
  return;
  // } else {
  //   res.redirect(`http://${longURL}`);
  //   return;
  // }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;
  if (inUserDb(usersDB, userID) && ownUrl(userID, urlDatabase, shortURL)) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
    return;
  }
  res.redirect("/login");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.userID;

  if (inUserDb(usersDB, userID)) {
    if (ownUrl(userID, urlDatabase, shortURL)) {
      if (req.body.newURL) {
        urlDatabase[shortURL].longURL = req.body.newURL;
        res.redirect("/urls");
        return;
      }
    }
    res.status(403).send("This is not your URL!");
    return;
  }
  res.redirect("/login");
});

app.get("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/login", (req, res) => {
  const userID = req.session.userID;
  const templateVars = {
    user: usersDB[userID],
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (emailExists(usersDB, email)) {
    const userID = userIdOfEmail(usersDB, email);
    if (bcrypt.compareSync(password, usersDB[userID].password)) {
      req.session.userID = userIdOfEmail(usersDB, email);
      res.redirect("/urls");
      return;
    } else {
      res.status(403).send("Incorrect Password");
      return;
    }
  } else {
    res.status(403).send("Email Doesn't Exist!");
    return;
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.clearCookie("session.sig");

  return res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const userID = req.session.userID;
  const templateVars = {
    user: usersDB[userID],
  };
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    if (emailExists(usersDB, email) === false) {
      const userID = generateRandomString();
      usersDB[userID] = {
        id: userID,
        email,
        password: bcrypt.hashSync(password, 10),
      };
      req.session.userID = userID;
      res.redirect("/urls");
      return;
    } else {
      res.status(400).send("Email Already Exists");
      return;
    }
  } else {
    res.status(400).send("Don't leave Email/Password Blank!");
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});
