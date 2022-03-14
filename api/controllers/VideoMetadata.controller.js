const db = require("../index.js");
const VideoMetadata = db.VideoMetadata;
const Op = db.Sequelize.Op;

// Create and Save a new VideoMetadata
exports.create = (req, res) => {};

// Retrieve all VideoMetadata from the database.
exports.findAll = (req, res) => {};

// Find a single VideoMetadata with an id
exports.findOne = (req, res) => {
  VideoMetadata.findOne({
    where: {
      mediaId: req.params.id,
    },
    raw: true
  }).then(async (data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Update a VideoMetadata by the id in the request
exports.update = (req, res) => {
  VideoMetadata
    .update(req.body, {
      where: {
        mediaId: parseInt(req.params.id)
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

// Delete a VideoMetadata with the specified id in the request
exports.delete = (req, res) => {};

// Delete all VideoMetadata from the database.
exports.deleteAll = (req, res) => {};