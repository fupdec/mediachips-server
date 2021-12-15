module.exports = app => {
  const Functions = require("../controllers/Functions.controller");

  const router = require("express").Router();

  // importing old database from JSON
  router.post("/importDatabase", Functions.importDatabase);

  // creating thumbnail for video
  router.post("/createThumb", Functions.createThumb);

  app.use('/api/Functions/', router);
};