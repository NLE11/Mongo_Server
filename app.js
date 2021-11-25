var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("dotenv").config();
require("./models/setupMongo")(); // Import the connect function

var taskRouter = require("./routes/task");
var authRouter = require("./routes/auth");
var userRouter = require("./routes/user");

var app = express();

app.use(logger("dev"));
app.use(express.json()); // Parsing json bodies
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser()); // Parse cookies as part of the request
// app.use(express.static(path.join(__dirname, "public"))); // A public folder to post static files for this express

app.use("/auth", authRouter); // Pass authrouter to express
app.use("/task", taskRouter);
app.use("/user", userRouter);

// Make the app to send files to client
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

module.exports = app;
