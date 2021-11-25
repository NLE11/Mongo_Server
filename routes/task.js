var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

const privateKey = process.env.JWT_PRIVATE_KEY;
// Add a middleware here
router.use(function (req, res, next) {
  console.log(req.header("Authorization"));
  if (req.header("Authorization")) {
    // Check if an access token is passed
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, {
        // Retrieve value from header: acces token, the private key we sign for the token, and the agorithm
        algorithms: ["RS256"],
      });
      console.log(req.payload);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  const tasks = await Task.find().where("author").equals(req.payload.id).exec();
  return res.status(200).json({ tasks: tasks });
});

router.get("/:taskId", async function (req, res, next) {
  //mongoose find query to retrieve task where taskId == req.params.taskId
  const task = await Task.findOne()
    .where("_id")
    .equals(req.params.taskId)
    .exec();

  return res.status(200).json(task);
});

router.post("/", function (req, res) {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dateCreated: req.body.dateCreated,
    dateCompleted: req.body.dateCompleted,
    complete: req.body.complete,
    author: req.payload.id,
  });

  console.log(task);

  task
    .save()
    .then((savedTask) => {
      return res.status(201).json({
        id: savedTask._id,
        title: savedTask.title,
        description: savedTask.description,
        dateCreated: savedTask.dateCreated,
        dateCompleted: savedTask.dateCompleted,
        complete: savedTask.complete,
        author: savedTask.author,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
});

module.exports = router;
