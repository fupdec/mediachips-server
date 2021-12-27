module.exports = app => {
  const ItemsInItem = require("../controllers/ItemsInItem.controller");

  const router = require("express").Router();

  // Create a new ItemsInItem
  router.post("/", ItemsInItem.create);

  // Retrieve all ItemsInItem
  router.get("/", ItemsInItem.findAll);

  // Retrieve a single ItemsInItem with id
  router.get("/:id", ItemsInItem.findOne);

  // Update a ItemsInItem with id
  router.put("/:id", ItemsInItem.update);

  // Delete a ItemsInItem with id
  router.delete("/:id", ItemsInItem.delete);

  // Delete all ItemsInItem
  router.delete("/", ItemsInItem.deleteAll);

  app.use('/api/ItemsInItem', router);
};