const db = require("../index.js");
const MediaTypes = db.MediaTypes;
const Op = db.Sequelize.Op;

// Create and Save a new MediaType
exports.create = (req, res) => {

};

// Retrieve all MediaTypes from the database.
exports.findAll = (req, res) => {
  MediaTypes.findAll({
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

};

// Update a MediaType by the id in the request
exports.update = (req, res) => {

};

// Delete a MediaType with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all MediaTypes from the database.
exports.deleteAll = (req, res) => {

};