module.exports = (app, db) => {
  const ChildMeta = require("../controllers/ChildMeta.controller")(db);
  const router = require("express").Router();

  // Create a new ChildMeta
  router.post("/", ChildMeta.create);

  // Retrieve all ChildMeta
  router.get("/", ChildMeta.findAll);

  // Update a ChildMeta with id
  router.put("/", ChildMeta.update);

  // Delete a ChildMeta with ChildMetaId
  router.delete("/:id", ChildMeta.deleteOne);

  app.use('/api/ChildMeta', router);
};