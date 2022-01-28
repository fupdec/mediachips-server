const {
  MetaInMediaType,
  Meta
} = require("../index.js");

// Create and Save a new MetaInMediaType
exports.create = (req, res) => {};

// Retrieve all MetaInMediaType from the database.
exports.findAll = async (req, res) => {
  MetaInMediaType.findAll({
    where: {
      typeId: req.query.typeId
    },
    include: [Meta],
    raw: true
  }).then(async (data) => {
    res.status(201).send(data)
  }).catch(err => {
    console.log(err)
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