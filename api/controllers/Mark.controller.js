const {
  Item,
  Mark,
  Meta,
  MetaSetting
} = require("../index.js");

// Create and Save a new Mark
exports.create = (req, res) => {
  Mark.create(req.body).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Retrieve all Mark for video from the database.
exports.findAll = (req, res) => {};

// Retrieve all Mark for video from the database.
exports.findAllForVideo = (req, res) => {
  Mark.findAll({
      where: {
        mediaId: req.params.id
      },
      order: [
        ['time', 'ASC']
      ],
      include: [Item],
      raw: true
    })
    .then(async marks => {
      for (let mark of marks) {
        let meta = await Meta.findOne({
          where: {
            id: mark['item.metaId']
          },
          include: [MetaSetting],
          raw: true
        })
        mark.meta = meta
      }
      res.status(201).send(marks)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single Mark with an id
exports.findOne = (req, res) => {};

// Update a Mark by the id in the request
exports.update = (req, res) => {};

// Delete a Mark with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Mark from the database.
exports.deleteAll = (req, res) => {};