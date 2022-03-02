const {
  Meta,
  ValuesInItem
} = require("../index.js");

// Create and Save a new Value
exports.create = (req, res) => {
  ValuesInItem.bulkCreate(req.body).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Retrieve all Values from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  ValuesInItem.findAll({
    where: {
      itemId: req.query.itemId
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

// Find a single Value with an id
exports.findOne = (req, res) => {};

// Update a Value by the id in the request
exports.update = (req, res) => {};

// Delete a Value with the specified id in the request
exports.delete = (req, res) => {
  ValuesInItem
    .destroy({
      where: {
        itemId: req.params.id
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

// Delete all Values from the database.
exports.deleteAll = (req, res) => {};