const {
  Item,
  ItemsInFilterRow
} = require("../index.js");

// Create and Save a new ItemsInFilterRow
exports.create = (req, res) => {};

// Retrieve all ItemsInFilterRow from the database.
exports.findAll = (req, res) => {
  ItemsInFilterRow.findAll({
    where: {
      rowId: req.query.rowId
    },
    include: [Item],
    raw: true
  }).then((data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Find a single ItemsInFilterRow with an id
exports.findOne = (req, res) => {};

// Update a ItemsInFilterRow by the id in the request
exports.update = (req, res) => {};

// Delete a ItemsInFilterRow with the specified id in the request
exports.delete = (req, res) => {};

// Delete all ItemsInFilterRow from the database
exports.deleteAll = (req, res) => {};