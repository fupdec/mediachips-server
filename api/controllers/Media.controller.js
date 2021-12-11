const db = require("../index.js");
const Media = db.Media;
const VideoMetadata = db.VideoMetadata;
const ItemsInMedia = db.ItemsInMedia;
const Op = db.Sequelize.Op;

// Create and Save a new Media
exports.create = (req, res) => {};

// Retrieve all Media from the database.
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
    type,
    query
  } = req.query
  const {
    limit,
    offset
  } = getPagination(page, size)

  Media.findAndCountAll({
    limit,
    offset,
    where: {
      typeId: type || 1,
      path: {
        [Op.like]: `%${query}%`
      },
    },
    order: [
      ['rating', 'DESC']
    ],
    // include: { all: true }
    include: [VideoMetadata]
  }).then(data => {
    const response = getPagingData(data, page, limit)
    res.status(201).send(response)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Find a single Media with an id
exports.countInItem = (req, res) => {
  Media.count({
    where: {
      typeId: req.query.typeId,
    },
    include: [{
      model: ItemsInMedia,
      where: {
        itemId: req.query.itemId
      },
      required: true
    }]
  }).then(number => {
    res.status(201).send({
      count: number
    })
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Find a single Media with an id
exports.findOne = (req, res) => {};

// Update a Media by the id in the request
exports.update = (req, res) => {};

// Delete a Media with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Media from the database.
exports.deleteAll = (req, res) => {};