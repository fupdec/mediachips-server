module.exports = app => {
  const VideoMetadata = require("../controllers/VideoMetadata.controller");

  const router = require("express").Router();

  // Create a new VideoMetadata
  router.post("/", VideoMetadata.create);

  // Retrieve all VideoMetadata
  router.get("/", VideoMetadata.findAll);

  // Retrieve a single VideoMetadata with id
  router.get("/:id", VideoMetadata.findOne);

  // Update a VideoMetadata with id
  router.put("/:id", VideoMetadata.update);

  // Delete a VideoMetadata with id
  router.delete("/:id", VideoMetadata.delete);

  // Delete all VideoMetadata
  router.delete("/", VideoMetadata.deleteAll);

  app.use('/api/VideoMetadata', router);
};