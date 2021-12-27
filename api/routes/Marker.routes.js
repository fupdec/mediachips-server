module.exports = app => {
  const Marker = require("../controllers/Marker.controller");

  const router = require("express").Router();

  // Create a new Marker
  router.post("/", Marker.create);

  // Retrieve all Marker from the database.
  router.get("/", Marker.findAll);

  // Retrieve all Marker for video from the database.
  router.get("/video/:id", Marker.findAllForVideo);

  // Retrieve a single Marker with id
  router.get("/:id", Marker.findOne);

  // Update a Marker with id
  router.put("/:id", Marker.update);

  // Delete a Marker with id
  router.delete("/:id", Marker.delete);

  // Delete all Marker
  router.delete("/", Marker.deleteAll);

  app.use('/api/Marker', router);
};