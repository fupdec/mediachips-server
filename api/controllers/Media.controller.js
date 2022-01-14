const db = require("../index.js");
const {
  Media,
  VideoMetadata,
  ItemsInMedia
} = require("../index.js");
const Op = db.Sequelize.Op;
const Functions = require('./Functions.controller')

// Create and Save a new Media
exports.create = (req, res) => {};

// Retrieve all Media from the database.
exports.findAll = (req, res) => {
  db.sequelize.query(req.body.query, {
    raw: true
  }).then(async data => {
    const total = await Media.findAndCountAll({
      where: {
        typeId: req.body.typeId,
      },
      raw: true
    })
    res.status(201).send({
      items: data[0],
      total: total.count,
    })
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Find a single Media with an id
exports.countInItem = (req, res) => {
  Media.count({
    where: {
      typeId: req.query.typeId,
    },
    include: [{
      model: ItemsInMedia,
      where: {
        itemId: req.query.itemId
      },
      required: true
    }]
  }).then(number => {
    res.status(201).send({
      count: number
    })
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Find a single Media with an id
exports.findOne = (req, res) => {};

// Update a Media by the id in the request
exports.update = (req, res) => {};

// Delete a Media with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Media from the database.
exports.deleteAll = (req, res) => {};