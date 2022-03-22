module.exports = (app, db) => {
  const Media = require("../controllers/Media.controller")(db);
  const router = require("express").Router();

  // Retrieve all Media
  router.post("/filter", Media.findAll);

  // Retrieve a single Media with id
  router.get("/countInItem", Media.countInItem);
  
  // Update a Media with id
  router.put("/:id", Media.update);

  app.use('/api/Media', router);
};