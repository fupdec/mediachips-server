const {
  Meta,
  Item,
  ItemsInItem
} = require("../index.js");

// Create and Save a new ItemsInItem
exports.create = (req, res) => {};

// Retrieve all ItemsInItems from the database.
exports.findAll = (req, res) => {
  ItemsInItem.findAll({
    where: {
      parentItemId: req.query.itemId
    },
    include: [{
      model: Item,
      attributes: ['name', 'color', 'metaId'],
      include: [{
        model: Meta,
        attributes: ['name', 'icon'],
      }],
    }],
  }).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Find a single ItemsInItem with an id
exports.findOne = (req, res) => {};

// Update a ItemsInItem by the id in the request
exports.update = (req, res) => {};

// Delete a ItemsInItem with the specified id in the request
exports.delete = (req, res) => {};

// Delete all ItemsInItem from the database
exports.deleteAll = (req, res) => {};