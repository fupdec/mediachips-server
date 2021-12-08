module.exports = app => {
  const ChildMeta = require("../controllers/ChildMeta.controller");

  const router = require("express").Router();

  // Create a new Tutorial
  router.post("/", ChildMeta.create);

  // Retrieve all Tutorials
  router.get("/", ChildMeta.findAll);

  // Retrieve a single Tutorial with id
  router.get("/:id", ChildMeta.findOne);

  // Update a Tutorial with id
  router.put("/:id", ChildMeta.update);

  // Delete a Tutorial with id
  router.delete("/:id", ChildMeta.delete);

  // Delete all Tutorials
  router.delete("/", ChildMeta.deleteAll);

  app.use('/api/ChildMeta', router);
};