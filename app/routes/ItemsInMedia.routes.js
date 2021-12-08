module.exports = app => {
  const ItemsInMedia = require("../controllers/ItemsInMedia.controller");

  const router = require("express").Router();

  // Create a new ItemsInMedia
  router.post("/", ItemsInMedia.create);

  // Retrieve all ItemsInMedia
  router.get("/", ItemsInMedia.findAll);

  // Retrieve a single ItemsInMedia with id
  router.get("/:id", ItemsInMedia.findOne);

  // Update a ItemsInMedia with id
  router.put("/:id", ItemsInMedia.update);

  // Delete a ItemsInMedia with id
  router.delete("/:id", ItemsInMedia.delete);

  // Delete all ItemsInMedia
  router.delete("/", ItemsInMedia.deleteAll);

  app.use('/api/ItemsInMedia', router);
};