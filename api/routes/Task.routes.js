module.exports = (app, db) => {
  const Task = require("../controllers/Task.controller")(db);
  const router = require("express").Router();

  // importing old database from JSON
  router.post("/importDatabase", Task.importDatabase);

  // check if file exists on local machine
  router.post("/checkFileExists", Task.checkFileExists);

  // open folder in file explorer
  router.post("/openPath", Task.openPath);

  // getting file list with specific extension in directory
  router.post("/getFileList", Task.getFileList);

  // adding video with metadata to database
  router.post("/addMediaVideo", Task.addMediaVideo);

  // adding image with metadata to database
  router.post("/addMediaImage", Task.addMediaImage);

  // adding media with type audio to database
  router.post("/addMediaAudio", Task.addMediaAudio);

  // adding media with type text to database
  router.post("/addMediaText", Task.addMediaText);

  // adding other type of media with metadata to database
  router.post("/addMedia", Task.addMedia);

  // creating default thumbnail for video
  router.post("/createThumbForVideo", Task.createThumbForVideo);

  // creating thumbnail for video
  router.post("/createThumb", Task.createThumb);

  // creating frames grid for video
  router.post("/createGrid", Task.createGrid);

  // creating frames timeline for video
  router.post("/createTimeline", Task.createTimeline);

  // check serial key
  router.get("/getMachineId", Task.getMachineId);

  // creating image that recived from cropper
  router.post("/createImage", Task.createImage);

  // deleting image from database
  router.post("/deleteImage", Task.deleteImage);

  // creating new database
  router.post("/createDb", Task.createDb);

  // editing database
  router.post("/editDb", Task.editDb);

  // selecting database
  router.post("/selectDb", Task.selectDb);

  // deleting database
  router.post("/deleteDb", Task.deleteDb);

  // creating backup
  router.get("/createBackup", Task.createBackup);

  // get all backups
  router.get("/getBackups", Task.getBackups);

  // delete backup
  router.post("/deleteBackup", Task.deleteBackup);

  // get folder Size
  router.post("/getFolderSize", Task.getFolderSize);

  // clear images, tables
  router.post("/clearData", Task.clearData);

  app.use('/api/Task', router);
};