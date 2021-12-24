const db = require("../index.js");
const {
  WatchedFolders,
  MediaTypes
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new Folder
exports.create = (req, res) => {
  WatchedFolders
    .create(req.body)
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Retrieve all Folders from the database.
exports.findAll = (req, res) => {
  WatchedFolders
    .findAll({
      include: [{
        model: MediaTypes,
      }],
      raw: true
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

// Find a single Folder with an id
exports.findOne = (req, res) => {};

// Update a Folder by the id in the request
exports.update = (req, res) => {
  WatchedFolders
    .update(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete a Folder with the specified id in the request
exports.delete = (req, res) => {
  WatchedFolders
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete all Folders from the database.
exports.deleteAll = (req, res) => {};