module.exports = app => {
  const ValuesInItem = require("../controllers/ValuesInItem.controller");

  const router = require("express").Router();

  // Create a new ValuesInItem
  router.post("/", ValuesInItem.create);

  // Retrieve all ValuesInItem
  router.get("/", ValuesInItem.findAll);

  // Retrieve a single ValuesInItem with id
  router.get("/:id", ValuesInItem.findOne);

  // Update a ValuesInItem with id
  router.put("/:id", ValuesInItem.update);

  // Delete a ValuesInItem with id
  router.delete("/:id", ValuesInItem.delete);

  // Delete all ValuesInItem
  router.delete("/", ValuesInItem.deleteAll);

  app.use('/api/ValuesInItem', router);
};