const {
  ChildMeta,
  Meta
} = require("../index.js");

// Create and Save a new ChildMeta
exports.create = (req, res) => {};

// Retrieve all ChildMetas from the database.
exports.findAll = (req, res) => {
  ChildMeta.findAll({
    where: {
      metaId: req.query.metaId
    },
    include: [Meta],
    raw: true
  }).then(async (data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Find a single ChildMeta with an id
exports.findOne = (req, res) => {};

// Update a ChildMeta by the id in the request
exports.update = (req, res) => {};

// Delete a ChildMeta with the specified id in the request
exports.delete = (req, res) => {};

// Delete all ChildMetas from the database.
exports.deleteAll = (req, res) => {};