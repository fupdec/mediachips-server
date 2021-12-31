module.exports = app => {
  const Setting = require("../controllers/Setting.controller");

  const router = require("express").Router();

  // Retrieve a single option with a name in the request
  router.get("/", Setting.findOne);

  // Update a single option with a name and value in the request
  router.put("/", Setting.update);

  app.use('/api/Setting', router);
};