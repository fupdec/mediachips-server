module.exports = app => {
  const MetaInMediaTypes = require("../controllers/MetaInMediaTypes.controller");

  const router = require("express").Router();

  // Create a new MetaInMediaType
  router.post("/", MetaInMediaTypes.create);

  // Retrieve all MetaInMediaTypes
  router.get("/", MetaInMediaTypes.findAll);

  // Retrieve a single MetaInMediaType with id
  router.get("/:id", MetaInMediaTypes.findOne);

  // Update a MetaInMediaType with id
  router.put("/:id", MetaInMediaTypes.update);

  // Delete a MetaInMediaType with id
  router.delete("/:id", MetaInMediaTypes.delete);

  // Delete all MetaInMediaTypes
  router.delete("/", MetaInMediaTypes.deleteAll);

  app.use('/api/MetaInMediaTypes', router);
};