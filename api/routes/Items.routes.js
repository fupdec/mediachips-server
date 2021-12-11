module.exports = app => {
  const Items = require("../controllers/Items.controller");

  const router = require("express").Router();

  // Create a new Item
  router.post("/", Items.create);

  // Retrieve all Items
  router.get("/", Items.findAll);

  // Retrieve a single Item with id
  router.get("/:id", Items.findOne);

  // Update a Item with id
  router.put("/:id", Items.update);

  // Delete a Item with id
  router.delete("/:id", Items.delete);

  // Delete all Items
  router.delete("/", Items.deleteAll);

  app.use('/api/Items', router);
};