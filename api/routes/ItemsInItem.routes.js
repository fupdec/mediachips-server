module.exports = app => {
  const ItemsInItem = require("../controllers/ItemsInItem.controller");

  const router = require("express").Router();

  // Create a new ItemsInItem
  router.post("/", ItemsInItem.create);

  // Retrieve all ItemsInItem
  router.get("/", ItemsInItem.findAll);

  // Delete a ItemsInItem with id
  router.delete("/:id", ItemsInItem.delete);

  app.use('/api/ItemsInItem', router);
};