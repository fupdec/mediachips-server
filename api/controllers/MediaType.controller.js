const db = require("../index.js");
const MediaType = db.MediaType;
const Op = db.Sequelize.Op;

// Create and Save a new MediaType
exports.create = (req, res) => {};

// Retrieve all MediaType from the database.
exports.findAll = (req, res) => {
  MediaType.findAll({
      raw: true
    })
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single MediaType with an id
exports.findOne = (req, res) => {
  MediaType.findOne({
    where: {
      id: req.params.id
    },
    raw: true
  })
  .then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Update a MediaType by the id in the request
exports.update = (req, res) => {};

// Delete a MediaType with the specified id in the request
exports.delete = (req, res) => {};

// Delete all MediaType from the database.
exports.deleteAll = (req, res) => {};