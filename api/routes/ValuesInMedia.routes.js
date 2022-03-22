module.exports = (app, db) => {
  const ValuesInMedia = require("../controllers/ValuesInMedia.controller")(db);
  const router = require("express").Router();

  // Create a new ValuesInMedia
  router.post("/", ValuesInMedia.create);

  // Retrieve all ValuesInMedia
  router.get("/", ValuesInMedia.findAll);

  // Delete a ValuesInMedia with id
  router.delete("/:id", ValuesInMedia.deleteOne);

  app.use('/api/ValuesInMedia', router);
};