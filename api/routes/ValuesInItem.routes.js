module.exports = (app, db) => {
  const ValuesInItem = require("../controllers/ValuesInItem.controller")(db);
  const router = require("express").Router();

  // Create a new ValuesInItem
  router.post("/", ValuesInItem.create);

  // Retrieve all ValuesInItem
  router.get("/", ValuesInItem.findAll);

  // Delete a ValuesInItem with id
  router.delete("/:id", ValuesInItem.deleteOne);

  app.use('/api/ValuesInItem', router);
};