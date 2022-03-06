module.exports = app => {
  const Task = require("../controllers/Task.controller");

  const router = require("express").Router();

  // importing old database from JSON
  router.post("/importDatabase", Task.importDatabase);

  // check if file exists on local machine
  router.post("/checkFileExists", Task.checkFileExists);

  // creating image that recived from cropper
  router.post("/createImage", Task.createImage);

  // deleting image from userfiles directory
  router.post("/deleteImage", Task.deleteImage);

  // adding video with metadata to database
  router.post("/addMediaVideo", Task.addMediaVideo);

  // creating thumbnail for video
  router.post("/createThumb", Task.createThumb);

  // creating frames grid for video
  router.post("/createGrid", Task.createGrid);

  // creating frames timeline for video
  router.post("/createTimeline", Task.createTimeline);

  // check serial key
  router.get("/getMachineId", Task.getMachineId);

  app.use('/api/Task', router);
};