module.exports = app => {
  const Setting = require("../controllers/Setting.controller");

  const router = require("express").Router();

  // Retrieve all options from the database
  router.get("/", Setting.findAll);

  // Retrieve a single option with a name
  router.get("/:option", Setting.findOne);

  // Update a single option with a name and value in the request
  router.put("/:option", Setting.update);

  app.use('/api/Setting', router);
};