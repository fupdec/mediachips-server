module.exports = app => {
  const ItemsInItems = require("../controllers/ItemsInItems.controller");

  const router = require("express").Router();

  // Create a new ItemsInItems
  router.post("/", ItemsInItems.create);

  // Retrieve all ItemsInItems
  router.get("/", ItemsInItems.findAll);

  // Retrieve a single ItemsInItems with id
  router.get("/:id", ItemsInItems.findOne);

  // Update a ItemsInItems with id
  router.put("/:id", ItemsInItems.update);

  // Delete a ItemsInItems with id
  router.delete("/:id", ItemsInItems.delete);

  // Delete all ItemsInItems
  router.delete("/", ItemsInItems.deleteAll);

  app.use('/api/ItemsInItems', router);
};