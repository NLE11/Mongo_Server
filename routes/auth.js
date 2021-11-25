var express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");

// Import bcrypt
const bcrypt = require("bcrypt");

const User = require("../models/User");

const saltRounds = 10;

const privateKey = process.env.JWT_PRIVATE_KEY;

// Middleware
router.use(function (req, res, next) {
  // Invoke this for every call to auth
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      // Hash the password and then save the result to the request
      req.hashedPassword = hash;
      next();
    });
  });
});

// We need two pieces of Middleware here to handle Registration and Login

router.post("/login", async function (req, res, next) {
  // We expect to pass a username and password
  if (req.body.username && req.body.password) {
    // Query the user records to find a user with username === req.body.user, select password (hashed)
    // use bcrypt to compare req.body.password to password hash retrieved from mongodb
    const user = await User.findOne()
      .where("username")
      .equals(req.body.username)
      .exec();
    if (user) {
      return bcrypt
        .compare(req.body.password, user.password)
        .then((result) => {
          if (result === true) {
            const token = jwt.sign({ id: user._id }, privateKey, {
              algorithm: "RS256",
            });
            return res.status(200).json({ access_token: token });
          } else {
            return res.status(401).json({ error: "Password incorrect" });
          }
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
    }
    return res.status(401).json({ error: "Username not found" });
  } else {
    res.status(400).json({ error: "Username or Password Missing" });
  }
});

router.post("/register", function (req, res, next) {
  // Add async here if doesnt work
  if (req.body.username && req.body.password && req.body.passwordConfirm) {
    if (req.body.password === req.body.passwordConfirm) {
      // Store username and password (hashed) respond with userId of persisted user
      const user = new User({
        username: req.body.username,
        password: req.hashedPassword,
      });
      user // Add await here if doesnt work
        .save() // Persisting user to the
        .then((savedUser) => {
          return res.status(201).json({
            id: savedUser._id,
            username: savedUser.username,
          });
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
      // res.json({
      //   password: req.body.password,
      //   hashedPassword: req.hashedPassword, // The response returns these two fields
      // });
    } else {
      res.status(400).json({ error: "Password does not match" });
    }
  } else {
    res
      .status(400)
      .json({ error: "Username or Password or PassConfirm Missing" });
  }
});

module.exports = router;
