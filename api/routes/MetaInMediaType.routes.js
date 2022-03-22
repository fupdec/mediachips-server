module.exports = (app, db) => {
  const MetaInMediaType = require("../controllers/MetaInMediaType.controller")(db);
  const router = require("express").Router();

  // Retrieve all MetaInMediaType
  router.get("/", MetaInMediaType.findAll);

  // Update a MetaInMediaType with id
  router.put("/", MetaInMediaType.update);

  app.use('/api/MetaInMediaType', router);
};