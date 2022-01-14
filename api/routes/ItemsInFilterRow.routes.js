module.exports = app => {
  const ItemsInFilterRow = require("../controllers/ItemsInFilterRow.controller");

  const router = require("express").Router();

  // Create a new ItemsInFilterRow
  router.post("/", ItemsInFilterRow.create);

  // Retrieve all ItemsInFilterRow
  router.get("/", ItemsInFilterRow.findAll);

  // Retrieve a single ItemsInFilterRow with id
  router.get("/:id", ItemsInFilterRow.findOne);

  // Update a ItemsInFilterRow with id
  router.put("/:id", ItemsInFilterRow.update);

  // Delete a ItemsInFilterRow with id
  router.delete("/:id", ItemsInFilterRow.delete);

  // Delete all ItemsInFilterRow
  router.delete("/", ItemsInFilterRow.deleteAll);

  app.use('/api/ItemsInFilterRow', router);
};