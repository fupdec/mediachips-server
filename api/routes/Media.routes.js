module.exports = app => {
  const Media = require("../controllers/Media.controller");

  const router = require("express").Router();

  // Create a new Media
  router.post("/", Media.create);

  // Retrieve all Media
  router.post("/filter", Media.findAll);

  // Retrieve a single Media with id
  router.get("/countInItem", Media.countInItem);
  
  // Retrieve a single Media with id
  router.get("/:id", Media.findOne);

  // Update a Media with id
  router.put("/:id", Media.update);

  // Delete a Media with id
  router.delete("/:id", Media.delete);

  // Delete all Media
  router.delete("/", Media.deleteAll);

  app.use('/api/Media', router);
};