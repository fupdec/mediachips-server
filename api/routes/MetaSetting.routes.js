module.exports = app => {
  const MetaSetting = require("../controllers/MetaSetting.controller");

  const router = require("express").Router();

  // Create a new MetaSetting
  router.post("/", MetaSetting.create);

  // Retrieve all MetaSetting
  router.get("/", MetaSetting.findAll);

  // Retrieve a single MetaSetting with id
  router.get("/:id", MetaSetting.findOne);

  // Update a MetaSetting with id
  router.put("/:id", MetaSetting.update);

  // Delete a MetaSetting with id
  router.delete("/:id", MetaSetting.delete);

  // Delete all MetaSetting
  router.delete("/", MetaSetting.deleteAll);

  app.use('/api/MetaSetting', router);
};