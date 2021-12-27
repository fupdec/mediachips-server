module.exports = app => {
  const ChildMeta = require("../controllers/ChildMeta.controller");

  const router = require("express").Router();

  // Create a new ChildMeta
  router.post("/", ChildMeta.create);

  // Retrieve all ChildMeta
  router.get("/", ChildMeta.findAll);

  // Retrieve a single ChildMeta with id
  router.get("/:id", ChildMeta.findOne);

  // Update a ChildMeta with id
  router.put("/:id", ChildMeta.update);

  // Delete a ChildMeta with id
  router.delete("/:id", ChildMeta.delete);

  // Delete all ChildMeta
  router.delete("/", ChildMeta.deleteAll);

  app.use('/api/ChildMeta', router);
};