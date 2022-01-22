module.exports = app => {
  const Functions = require("../controllers/Functions.controller");

  const router = require("express").Router();

  // importing old database from JSON
  router.post("/importDatabase", Functions.importDatabase);

  // creating thumbnail for video
  router.post("/createThumb", Functions.createThumb);

  // creating frames grid for video
  router.post("/createGrid", Functions.createGrid);

  // creating frames grid for video
  router.post("/createTimeline", Functions.createTimeline);

  app.use('/api/Functions/', router);
};