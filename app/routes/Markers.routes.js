module.exports = app => {
  const Markers = require("../controllers/Markers.controller");

  const router = require("express").Router();

  // Create a new Marker
  router.post("/", Markers.create);

  // Retrieve all Markers from the database.
  router.get("/", Markers.findAll);

  // Retrieve all Markers for video from the database.
  router.get("/video/:id", Markers.findAllForVideo);

  // Retrieve a single Marker with id
  router.get("/:id", Markers.findOne);

  // Update a Marker with id
  router.put("/:id", Markers.update);

  // Delete a Marker with id
  router.delete("/:id", Markers.delete);

  // Delete all Markers
  router.delete("/", Markers.deleteAll);

  app.use('/api/Markers', router);
};