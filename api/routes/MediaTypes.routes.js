module.exports = app => {
  const MediaTypes = require("../controllers/MediaTypes.controller");

  const router = require("express").Router();

  // Create a new MediaType
  router.post("/", MediaTypes.create);

  // Retrieve all MediaTypes
  router.get("/", MediaTypes.findAll);

  // Retrieve a single MediaType with id
  router.get("/:id", MediaTypes.findOne);

  // Update a MediaType with id
  router.put("/:id", MediaTypes.update);

  // Delete a MediaType with id
  router.delete("/:id", MediaTypes.delete);

  // Delete all MediaTypes
  router.delete("/", MediaTypes.deleteAll);

  app.use('/api/MediaTypes', router);
};