const db = require("../index.js");
const {
  Meta,
  MetaSetting
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new Meta
exports.create = (req, res) => {
  Meta.create(req.body, {
      include: [MetaSetting]
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

// Retrieve all Metas from the database.
exports.findAll = (req, res) => {
  Meta.findAll({
      include: {
        model: MetaSetting
      }
    })
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single Meta with an id
exports.findOne = (req, res) => {};

// Find a single Meta with an id
exports.findLatest = (req, res) => {
  Meta.findAll({
      limit: 1,
      include: {
        model: MetaSetting
      },
      order: [
        ['createdAt', 'DESC']
      ]
    })
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Update a Meta by the id in the request
exports.update = (req, res) => {
  Meta
    .update(req.body, {
      where: {
        id: parseInt(req.params.id)
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

// Delete a Meta with the specified id in the request
exports.delete = (req, res) => {
  Meta
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      // TODO delete folder with images of the meta
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete all Metas from the database.
exports.deleteAll = (req, res) => {};