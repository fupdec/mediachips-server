module.exports = (app, db) => {
  const ItemsInItem = require("../controllers/ItemsInItem.controller")(db);
  const router = require("express").Router();

  // Create a new ItemsInItem
  router.post("/", ItemsInItem.create);

  // Retrieve all ItemsInItem
  router.get("/", ItemsInItem.findAll);

  // Delete a ItemsInItem with id
  router.delete("/:id", ItemsInItem.deleteOne);

  app.use('/api/ItemsInItem', router);
};