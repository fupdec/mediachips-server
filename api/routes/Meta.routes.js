module.exports = app => {
  const Meta = require("../controllers/Meta.controller");

  const router = require("express").Router();

  // Create a new Meta
  router.post("/", Meta.create);

  // Retrieve all Meta
  router.get("/", Meta.findAll);

  // Retrieve a single Meta with id
  router.get("/:id", Meta.findOne);

  // Update a Meta with id
  router.put("/:id", Meta.update);

  // Delete a Meta with id
  router.delete("/:id", Meta.delete);

  // Delete all Meta
  router.delete("/", Meta.deleteAll);

  app.use('/api/Meta', router);
};