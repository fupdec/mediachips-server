module.exports = app => {
  const ValuesInItems = require("../controllers/ValuesInItems.controller");

  const router = require("express").Router();

  // Create a new ValuesInItems
  router.post("/", ValuesInItems.create);

  // Retrieve all ValuesInItems
  router.get("/", ValuesInItems.findAll);

  // Retrieve a single ValuesInItems with id
  router.get("/:id", ValuesInItems.findOne);

  // Update a ValuesInItems with id
  router.put("/:id", ValuesInItems.update);

  // Delete a ValuesInItems with id
  router.delete("/:id", ValuesInItems.delete);

  // Delete all ValuesInItems
  router.delete("/", ValuesInItems.deleteAll);

  app.use('/api/ValuesInItems', router);
};