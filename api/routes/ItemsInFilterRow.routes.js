module.exports = (app, db) => {
  const ItemsInFilterRow = require("../controllers/ItemsInFilterRow.controller")(db);
  const router = require("express").Router();

  // Retrieve all ItemsInFilterRow
  router.get("/", ItemsInFilterRow.findAll);

  app.use('/api/ItemsInFilterRow', router);
};