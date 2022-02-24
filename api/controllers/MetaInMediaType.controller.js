const {
  MetaInMediaType,
  MetaSetting,
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
    include: [{
      model: Meta,
      include: [MetaSetting]
    }],
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
exports.update = (req, res) => {
  MetaInMediaType.update(req.body.data, {
    where: {
      metaId: req.body.metaId,
      typeId: req.body.typeId
    }
  }).then((data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Delete a MetaInMediaType with the specified id in the request
exports.delete = (req, res) => {};

// Delete all MetaInMediaType from the database.
exports.deleteAll = (req, res) => {};