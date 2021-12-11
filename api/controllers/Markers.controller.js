const db = require("../index.js");
const Markers = db.Markers;
const Meta = db.Meta;
const MetaSettings = db.MetaSettings;
const Items = db.Items;
const Op = db.Sequelize.Op;

// Create and Save a new Marker
exports.create = (req, res) => {};

// Retrieve all Markers for video from the database.
exports.findAll = (req, res) => {};

// Retrieve all Markers for video from the database.
exports.findAllForVideo = (req, res) => {
  Markers.findAll({
      where: {
        mediaId: req.params.id
      },
      order: [
        ['time', 'ASC']
      ],
      include: [Items],
      raw: true
    })
    .then(async markers => {
      for (let marker of markers) {
        let meta = await Meta.findOne({
          where: {
            id: marker['Item.metaId']
          },
          include: [MetaSettings],
          raw: true
        })
        marker.meta = meta
      }
      res.status(201).send(markers)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single Marker with an id
exports.findOne = (req, res) => {};

// Update a Marker by the id in the request
exports.update = (req, res) => {};

// Delete a Marker with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Markers from the database.
exports.deleteAll = (req, res) => {};