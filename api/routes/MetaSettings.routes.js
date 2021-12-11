module.exports = app => {
  const MetaSettings = require("../controllers/MetaSettings.controller");

  const router = require("express").Router();

  // Create a new MetaSettings
  router.post("/", MetaSettings.create);

  // Retrieve all MetaSettings
  router.get("/", MetaSettings.findAll);

  // Retrieve a single MetaSettings with id
  router.get("/:id", MetaSettings.findOne);

  // Update a MetaSettings with id
  router.put("/:id", MetaSettings.update);

  // Delete a MetaSettings with id
  router.delete("/:id", MetaSettings.delete);

  // Delete all MetaSettings
  router.delete("/", MetaSettings.deleteAll);

  app.use('/api/MetaSettings', router);
};