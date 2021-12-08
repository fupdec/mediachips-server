const db = require("../index.js");
const ItemsInMedia = db.ItemsInMedia;
const Items = db.Items;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {

};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  ItemsInMedia.findAll({
    where: {
      mediaId: req.query.mediaId
    },
    include: [{
      model: Items,
      attributes: ['name', 'color'],
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