const db = require("../index.js");
const {
  Meta,
  MetaSettings
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new Meta
exports.create = (req, res) => {
  Meta
    .create(req.body)
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Retrieve all Metas from the database.
exports.findAll = (req, res) => {
  Meta.findAll({
      include: {
        model: MetaSettings
      }
    })
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single Meta with an id
exports.findOne = (req, res) => {};

// Update a Meta by the id in the request
exports.update = (req, res) => {};

// Delete a Meta with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Metas from the database.
exports.deleteAll = (req, res) => {};