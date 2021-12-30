module.exports = app => {
  const PageSetting = require("../controllers/PageSetting.controller");

  const router = require("express").Router();

  // Retrieve all settings for one page
  router.get("/", PageSetting.findOne);

  // Update a single option with a name and value in the request
  router.post("/", PageSetting.update);

  app.use('/api/PageSetting', router);
};