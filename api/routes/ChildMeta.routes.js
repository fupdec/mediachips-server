module.exports = app => {
  const ChildMeta = require("../controllers/ChildMeta.controller");

  const router = require("express").Router();

  // Create a new ChildMeta
  router.post("/", ChildMeta.create);

  // Retrieve all ChildMeta
  router.get("/", ChildMeta.findAll);

  // Retrieve all ChildMeta with parent metaId
  router.get("/:id", ChildMeta.findAll);

  // Update a ChildMeta with id
  router.put("/:id", ChildMeta.update);

  // Delete a ChildMeta with ChildMetaId
  router.delete("/:id", ChildMeta.delete);

  // Delete all ChildMeta
  router.delete("/", ChildMeta.deleteAll);

  app.use('/api/ChildMeta', router);
};