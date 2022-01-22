module.exports = app => {
  const Task = require("../controllers/Task.controller");

  const router = require("express").Router();

  // importing old database from JSON
  router.post("/importDatabase", Task.importDatabase);

  // creating thumbnail for video
  router.post("/createThumb", Task.createThumb);

  // creating frames grid for video
  router.post("/createGrid", Task.createGrid);

  // creating frames grid for video
  router.post("/createTimeline", Task.createTimeline);

  app.use('/api/Task/', router);
};