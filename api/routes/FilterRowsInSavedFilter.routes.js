module.exports = app => {
  const FilterRowsInSavedFilter = require("../controllers/FilterRowsInSavedFilter.controller");

  const router = require("express").Router();

  // Create a new FilterRowsInSavedFilter
  router.post("/", FilterRowsInSavedFilter.create);

  // Retrieve all FilterRowsInSavedFilter
  router.get("/", FilterRowsInSavedFilter.findAll);

  // Retrieve a single FilterRowsInSavedFilter with id
  router.get("/:id", FilterRowsInSavedFilter.findOne);

  // Update a FilterRowsInSavedFilter with id
  router.put("/:id", FilterRowsInSavedFilter.update);

  // Delete a FilterRowsInSavedFilter with id
  router.delete("/:id", FilterRowsInSavedFilter.delete);

  // Delete all FilterRowsInSavedFilter
  router.delete("/", FilterRowsInSavedFilter.deleteAll);

  app.use('/api/FilterRowsInSavedFilter', router);
};