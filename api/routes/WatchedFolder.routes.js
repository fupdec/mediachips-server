module.exports = app => {
  const WatchedFolder = require("../controllers/WatchedFolder.controller");

  const router = require("express").Router();

  // Create a new WatchedFolder
  router.post("/", WatchedFolder.create);

  // Retrieve all WatchedFolder
  router.get("/", WatchedFolder.findAll);

  // Retrieve a single WatchedFolder with id
  router.get("/:id", WatchedFolder.findOne);

  // Update a WatchedFolder with id
  router.put("/:id", WatchedFolder.update);

  // Delete a WatchedFolder with id
  router.delete("/:id", WatchedFolder.delete);

  // Delete all WatchedFolder
  router.delete("/", WatchedFolder.deleteAll);

  app.use('/api/WatchedFolder', router);
};