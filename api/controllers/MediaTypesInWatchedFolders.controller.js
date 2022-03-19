const {
  MediaTypesInWatchedFolders,
  MediaType,
  WatchedFolder
} = require("../index.js");

// Create and Save a new MediaTypesInWatchedFolders
exports.create = (req, res) => {};

// Retrieve all MediaTypesInWatchedFolders from the database.
exports.findAll = (req, res) => {
  MediaTypesInWatchedFolders
    .findAll({
      include: [MediaType, WatchedFolder]
    })
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single MediaTypesInWatchedFolders with an id
exports.findOne = (req, res) => {};

// Update a MediaTypesInWatchedFolders by the id in the request
exports.update = (req, res) => {};

// Delete a MediaTypesInWatchedFolders with the specified id in the request
exports.delete = (req, res) => {};

// Delete all MediaTypesInWatchedFolders from the database
exports.deleteAll = (req, res) => {};