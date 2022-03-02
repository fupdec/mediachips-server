const db = require("../index.js");
const Item = db.Item;

// Create and Save a new Item
exports.create = (req, res) => {};

// Retrieve all Item from the database.
exports.findAll = (req, res) => {
  db.sequelize.query(req.body.query, {
    raw: true
  }).then(async data => {
    const total = await Item.findAndCountAll({
      where: {
        metaId: req.body.metaId,
      },
      raw: true
    })

    res.status(201).send({
      items: data[0],
      total: total.count,
    })
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Retrieve all Item from the database.
exports.rawQuery = (req, res) => {
  db.sequelize.query(req.body.query)
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving media."
      })
    })
};

// Find a single Item with an id
exports.findOne = (req, res) => {
  Item.findOne({
    where: {
      id: req.params.id
    }
  }).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Retrieve all Item from the database.
exports.getAll = (req, res) => {
  Item.findAll({
    raw: true
  }).then(data => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Update a Item by the id in the request
exports.update = (req, res) => {
  Item.update(req.body, {
    where: {
      id: req.params.id,
    }
  }).then((data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Delete a Item with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Item from the database.
exports.deleteAll = (req, res) => {};