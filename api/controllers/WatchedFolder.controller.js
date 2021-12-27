const db = require("../index.js");
const {
  WatchedFolder,
  MediaType
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new Folder
exports.create = (req, res) => {
  WatchedFolder
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
  WatchedFolder
    .findAll({
      include: [{
        model: MediaType,
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
  WatchedFolder
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
  WatchedFolder
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