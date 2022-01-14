const db = require("../index.js");
const {
  Item,
  FilterRowsInSavedFilter
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new FilterRowsInSavedFilter
exports.create = (req, res) => {};

// Retrieve all FilterRowsInSavedFilter from the database.
exports.findAll = (req, res) => {
  FilterRowsInSavedFilter.findAll({
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

// Find a single FilterRowsInSavedFilter with an id
exports.findOne = (req, res) => {};

// Update a FilterRowsInSavedFilter by the id in the request
exports.update = (req, res) => {};

// Delete a FilterRowsInSavedFilter with the specified id in the request
exports.delete = (req, res) => {};

// Delete all FilterRowsInSavedFilter from the database
exports.deleteAll = (req, res) => {};