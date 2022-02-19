module.exports = app => {
  const Task = require("../controllers/Task.controller");

  const router = require("express").Router();

  // importing old database from JSON
  router.post("/importDatabase", Task.importDatabase);

  // creating image that recived from cropper
  router.post("/createImage", Task.createImage);

  // creating thumbnail for video
  router.post("/createThumb", Task.createThumb);

  // creating frames grid for video
  router.post("/createGrid", Task.createGrid);

  // creating frames timeline for video
  router.post("/createTimeline", Task.createTimeline);

  // check serial key
  router.get("/getMachineId", Task.getMachineId);

  app.use('/api/Task/', router);
};