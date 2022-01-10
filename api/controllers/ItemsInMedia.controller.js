const db = require("../index.js");
const {
  Item,
  ItemsInMedia
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new ItemsInMedia
exports.create = (req, res) => {};

// Retrieve all ItemsInMedia from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  ItemsInMedia.findAll({
    where: {
      mediaId: req.query.mediaId
    },
    include: [{
      model: Item,
      attributes: ['name', 'color', 'metaId'],
    }],
    raw: true
  }).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Find a single ItemsInMedia with an id
exports.findOne = (req, res) => {

};

// Update a ItemsInMedia by the id in the request
exports.update = (req, res) => {

};

// Delete a ItemsInMedia with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all ItemsInMedia from the database.
exports.deleteAll = (req, res) => {

};