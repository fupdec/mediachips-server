const db = require("../index.js");
const Item = db.Item;
const Op = db.Sequelize.Op;

// Create and Save a new Item
exports.create = (req, res) => {};

// Retrieve all Item from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  const getPagination = (page, size) => {
    const limit = size ? +size : 20
    const offset = page ? page * limit : 0

    return {
      limit,
      offset
    }
  }
  const getPagingData = (data, page, limit) => {
    const {
      count: totalItems,
      rows: items
    } = data
    const currentPage = page ? +page : 0
    const totalPages = Math.ceil(totalItems / limit)

    return {
      totalItems,
      items,
      totalPages,
      currentPage
    }
  }

  const {
    page,
    size,
    metaId,
    query
  } = req.query
  const {
    limit,
    offset
  } = getPagination(page, size)

  Item.findAndCountAll({
    limit,
    offset,
    where: {
      metaId: metaId,
      name: {
        [Op.like]: `%${query}%`
      },
    },
  }).then(data => {
    const response = getPagingData(data, page, limit)
    res.status(201).send(response)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Find a single Item with an id
exports.findOne = (req, res) => {};

// Update a Item by the id in the request
exports.update = (req, res) => {};

// Delete a Item with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Item from the database.
exports.deleteAll = (req, res) => {};

// Find all published Item
exports.findAllPublished = (req, res) => {};