const {
  FilterRow,
  Meta
} = require("../index.js");

// Create and Save a new FilterRow
exports.create = (req, res) => {
  FilterRow.findOrCreate({
      where: {
        id: req.body.id,
      },
      defaults: req.body.filter,
    })
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Retrieve all FilterRows from the database.
exports.findAll = (req, res) => {};

// Find a single FilterRow with an id
exports.findOne = (req, res) => {
  FilterRow
    .findOne({
      where: {
        id: req.params.id
      }
    })
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Update a FilterRow by the id in the request
exports.update = (req, res) => {
  FilterRow
    .update(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete a FilterRow with the specified id in the request
exports.delete = (req, res) => {
  FilterRow
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete all FilterRows from the database.
exports.deleteAll = (req, res) => {};