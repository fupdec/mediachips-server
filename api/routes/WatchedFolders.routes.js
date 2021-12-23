module.exports = app => {
  const WatchedFolders = require("../controllers/WatchedFolders.controller");

  const router = require("express").Router();

  // Create a new WatchedFolders
  router.post("/", WatchedFolders.create);

  // Retrieve all WatchedFolders
  router.get("/", WatchedFolders.findAll);

  // Retrieve a single WatchedFolders with id
  router.get("/:id", WatchedFolders.findOne);

  // Update a WatchedFolders with id
  router.put("/:id", WatchedFolders.update);

  // Delete a WatchedFolders with id
  router.delete("/:id", WatchedFolders.delete);

  // Delete all WatchedFolders
  router.delete("/", WatchedFolders.deleteAll);

  app.use('/api/WatchedFolders', router);
};