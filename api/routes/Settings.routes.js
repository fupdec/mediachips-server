module.exports = app => {
  const Settings = require("../controllers/Settings.controller");

  const router = require("express").Router();

  // Retrieve a single option with a name in the request
  router.get("/", Settings.findOne);

  // Update a single option with a name and value in the request
  router.post("/", Settings.update);

  app.use('/api/Settings', router);
};