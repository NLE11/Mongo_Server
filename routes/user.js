var express = require("express");
var router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const users = await User.find().exec();
  return res.status(200).json({ users: users });
});

router.get("/:userId", async function (req, res, next) {
  //mongoose find query to retrieve task where taskId == req.params.taskId
  const user = await Task.find()
    .where("author")
    .equals(req.params.userId)
    .exec();

  return res.status(200).json(user);
});

module.exports = router;
