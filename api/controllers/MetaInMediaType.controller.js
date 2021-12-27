const db = require("../index.js");
const MediaType = db.MediaType;
const Meta = db.Meta;
const Op = db.Sequelize.Op;

// Create and Save a new MetaInMediaType
exports.create = (req, res) => {};

// Retrieve all MetaInMediaType from the database.
exports.findAll = async (req, res) => {
  let response = {}
  MediaType.findAll({
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

// Find a single MetaInMediaType with an id
exports.findOne = (req, res) => {};

// Update a MetaInMediaType by the id in the request
exports.update = (req, res) => {};

// Delete a MetaInMediaType with the specified id in the request
exports.delete = (req, res) => {};

// Delete all MetaInMediaType from the database.
exports.deleteAll = (req, res) => {};