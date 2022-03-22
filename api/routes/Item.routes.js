module.exports = (app, db) => {
  const Item = require("../controllers/Item.controller")(db);
  const router = require("express").Router();

  // Create a new Item
  router.post("/", Item.create);

  // Retrieve all Items that match the filter
  router.post("/filter", Item.findAll);


  // Retrieve a single Item with id
  router.get("/:id", Item.findOne);

  // Retrieve all Items
  router.get("/", Item.getAll);

  // Retrieve all Items that with name
  router.post("/search", Item.rawQuery);

  // Update a Item with id
  router.put("/:id", Item.update);

  app.use('/api/Item', router);
};