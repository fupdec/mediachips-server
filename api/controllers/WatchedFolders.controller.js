const db = require("../index.js");
const WatchedFolders = db.WatchedFolders;
const Op = db.Sequelize.Op;

// Create and Save a new Folder
exports.create = (req, res) => {};

// Retrieve all Folders from the database.
exports.findAll = (req, res) => {
  WatchedFolders.findAll()
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single Folder with an id
exports.findOne = (req, res) => {};

// Update a Folder by the id in the request
exports.update = (req, res) => {};

// Delete a Folder with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Folders from the database.
exports.deleteAll = (req, res) => {};