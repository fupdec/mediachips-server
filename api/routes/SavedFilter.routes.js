module.exports = app => {
  const SavedFilter = require("../controllers/SavedFilter.controller");

  const router = require("express").Router();

  // Create a new SavedFilter
  router.post("/", SavedFilter.create);

  // Retrieve all SavedFilter
  router.get("/", SavedFilter.findAll);

  // Retrieve a single SavedFilter with id
  router.get("/:id", SavedFilter.findOne);

  // Update a SavedFilter with id
  router.put("/:id", SavedFilter.update);

  // Delete a SavedFilter with id
  router.delete("/:id", SavedFilter.delete);

  // Delete all SavedFilter
  router.delete("/", SavedFilter.deleteAll);

  app.use('/api/SavedFilter', router);
};