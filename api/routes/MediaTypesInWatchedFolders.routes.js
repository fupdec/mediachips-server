module.exports = app => {
  const MediaTypesInWatchedFolders = require("../controllers/MediaTypesInWatchedFolders.controller");

  const router = require("express").Router();

  // Create a new MediaTypesInWatchedFolders
  router.post("/", MediaTypesInWatchedFolders.create);

  // Retrieve all MediaTypesInWatchedFolders
  router.get("/", MediaTypesInWatchedFolders.findAll);

  // Retrieve a single MediaTypesInWatchedFolders with id
  router.get("/:id", MediaTypesInWatchedFolders.findOne);

  // Update a MediaTypesInWatchedFolders with id
  router.put("/:id", MediaTypesInWatchedFolders.update);

  // Delete a MediaTypesInWatchedFolders with id
  router.delete("/:id", MediaTypesInWatchedFolders.delete);

  // Delete all MediaTypesInWatchedFolders
  router.delete("/", MediaTypesInWatchedFolders.deleteAll);

  app.use('/api/MediaTypesInWatchedFolders', router);
};