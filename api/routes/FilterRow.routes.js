module.exports = app => {
  const FilterRow = require("../controllers/FilterRow.controller");

  const router = require("express").Router();

  // Create a new FilterRow
  router.post("/", FilterRow.create);

  // Retrieve all FilterRow
  router.get("/", FilterRow.findAll);

  // Retrieve a single FilterRow with id
  router.get("/:id", FilterRow.findOne);

  // Update a FilterRow with id
  router.put("/:id", FilterRow.update);

  // Delete a FilterRow with id
  router.delete("/:id", FilterRow.delete);

  // Delete all FilterRow
  router.delete("/", FilterRow.deleteAll);

  app.use('/api/FilterRow', router);
};