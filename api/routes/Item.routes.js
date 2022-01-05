module.exports = app => {
  const Item = require("../controllers/Item.controller");

  const router = require("express").Router();

  // Create a new Item
  router.post("/", Item.create);

  // Retrieve all Item
  router.post("/filter", Item.findAll);

  // Retrieve a single Item with id
  router.get("/:id", Item.findOne);

  // Update a Item with id
  router.put("/:id", Item.update);

  // Delete a Item with id
  router.delete("/:id", Item.delete);

  // Delete all Item
  router.delete("/", Item.deleteAll);

  app.use('/api/Item', router);
};