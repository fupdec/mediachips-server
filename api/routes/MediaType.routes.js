module.exports = (app, db) => {
  const MediaType = require("../controllers/MediaType.controller")(db);
  const router = require("express").Router();

  // Retrieve all MediaType
  router.get("/", MediaType.findAll);

  // Retrieve a single MediaType with id
  router.get("/:id", MediaType.findOne);

  app.use('/api/MediaType', router);
};