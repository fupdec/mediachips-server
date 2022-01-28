module.exports = app => {
  const MetaInMediaType = require("../controllers/MetaInMediaType.controller");

  const router = require("express").Router();

  // Create a new MetaInMediaType
  router.post("/", MetaInMediaType.create);

  // Retrieve all MetaInMediaType
  router.get("/", MetaInMediaType.findAll);

  // Retrieve a single MetaInMediaType with id
  router.get("/:id", MetaInMediaType.findOne);

  // Update a MetaInMediaType with id
  router.put("/", MetaInMediaType.update);

  // Delete a MetaInMediaType with id
  router.delete("/:id", MetaInMediaType.delete);

  // Delete all MetaInMediaType
  router.delete("/", MetaInMediaType.deleteAll);

  app.use('/api/MetaInMediaType', router);
};