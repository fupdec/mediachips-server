const {
  Meta,
  ValuesInMedia
} = require("../index.js");

// Create and Save a new ValuesInMedia
exports.create = (req, res) => {
  ValuesInMedia.bulkCreate(req.body).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Retrieve all ValuesInMedia from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  ValuesInMedia.findAll({
    where: {
      mediaId: req.query.mediaId
    },
    include: [Meta],
  }).then((data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Find a single ValuesInMedia with an id
exports.findOne = (req, res) => {};

// Update a ValuesInMedia by the id in the request
exports.update = (req, res) => {};

// Delete a ValuesInMedia with the specified id in the request
exports.delete = (req, res) => {
  ValuesInMedia.destroy({
    where: {
      mediaId: req.params.id
    }
  }).then(() => {
    res.sendStatus(201)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Delete all ValuesInMedia from the database.
exports.deleteAll = (req, res) => {};