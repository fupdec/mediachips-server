module.exports = app => {
  const MetaSetting = require("../controllers/MetaSetting.controller");

  const router = require("express").Router();

  // Retrieve a single MetaSetting with id
  router.get("/:id", MetaSetting.findOne);

  // Update a MetaSetting with id
  router.put("/:id", MetaSetting.update);

  app.use('/api/MetaSetting', router);
};