const {
  Meta,
  Item,
  ItemsInItem
} = require("../index.js");

// Create and Save a new ItemsInItem
exports.create = (req, res) => {
  ItemsInItem.bulkCreate(req.body).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Retrieve all ItemsInItems from the database.
exports.findAll = (req, res) => {
  ItemsInItem.findAll({
    where: {
      parentItemId: req.query.itemId
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

// Delete a ItemsInItem with the specified id in the request
exports.delete = (req, res) => {
  ItemsInItem
    .destroy({
      where: {
        parentItemId: req.params.id
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