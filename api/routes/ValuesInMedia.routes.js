module.exports = app => {
  const ValuesInMedia = require("../controllers/ValuesInMedia.controller");

  const router = require("express").Router();

  // Create a new ValuesInMedia
  router.post("/", ValuesInMedia.create);

  // Retrieve all ValuesInMedia
  router.get("/", ValuesInMedia.findAll);

  // Retrieve a single ValuesInMedia with id
  router.get("/:id", ValuesInMedia.findOne);

  // Update a ValuesInMedia with id
  router.put("/:id", ValuesInMedia.update);

  // Delete a ValuesInMedia with id
  router.delete("/:id", ValuesInMedia.delete);

  // Delete all ValuesInMedia
  router.delete("/", ValuesInMedia.deleteAll);

  app.use('/api/ValuesInMedia', router);
};