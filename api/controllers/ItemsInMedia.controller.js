const {
  Item,
  ItemsInMedia,
  Meta
} = require("../index.js");

// Create many items in media
exports.bulkCreate = (req, res) => {
  ItemsInMedia.bulkCreate(req.body).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Create and Save a new ItemsInMedia
exports.create = (req, res) => {
  ItemsInMedia.findOrCreate({
    where: req.body
  }).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Retrieve all ItemsInMedia from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  ItemsInMedia.findAll({
    where: {
      mediaId: req.query.mediaId
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

// Find a single ItemsInMedia with an id
exports.findOne = (req, res) => {};

// Update a ItemsInMedia by the id in the request
exports.update = (req, res) => {};

// Delete a ItemsInMedia with the specified id in the request
exports.delete = (req, res) => {
  ItemsInMedia.destroy({
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

// Delete all ItemsInMedia from the database.
exports.deleteAll = (req, res) => {};