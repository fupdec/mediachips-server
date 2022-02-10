module.exports = app => {
  const Mark = require("../controllers/Mark.controller");

  const router = require("express").Router();

  // Create a new Mark
  router.post("/", Mark.create);

  // Retrieve all Mark from the database.
  router.get("/", Mark.findAll);

  // Retrieve all Mark for video from the database.
  router.get("/video/:id", Mark.findAllForVideo);

  // Retrieve a single Mark with id
  router.get("/:id", Mark.findOne);

  // Update a Mark with id
  router.put("/:id", Mark.update);

  // Delete a Mark with id
  router.delete("/:id", Mark.delete);

  // Delete all Mark
  router.delete("/", Mark.deleteAll);

  app.use('/api/Mark', router);
};