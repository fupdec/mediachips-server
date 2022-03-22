module.exports = (app, db) => {
  const ItemsInMedia = require("../controllers/ItemsInMedia.controller")(db);
  const router = require("express").Router();

  // Create many ItemsInMedia
  router.post("/", ItemsInMedia.bulkCreate);
  
  // find or create a new ItemsInMedia
  router.post("/createOne", ItemsInMedia.create);

  // Retrieve all ItemsInMedia
  router.get("/", ItemsInMedia.findAll);

  // Delete a ItemsInMedia with id
  router.delete("/:id", ItemsInMedia.deleteOne);

  app.use('/api/ItemsInMedia', router);
};