const db = require("../index.js");
const MetaInMediaTypes = db.MetaInMediaTypes;
const MediaTypes = db.MediaTypes;
const Meta = db.Meta;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {

};

// Retrieve all Tutorials from the database.
exports.findAll = async (req, res) => {
  let response = {}
  MediaTypes.findAll({
      include: {
        model: Meta
      },
      raw: true
    })
    .then(async data => {
      response.assigned = data
      response.meta = await Meta.findAll()
      res.status(201).send(response)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {

};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};