const db = require("../index.js");
const {
  Media,
  VideoMetadata,
  ItemsInMedia
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new Media
exports.create = (req, res) => {};

// Retrieve all Media from the database.
exports.findAll = async (req, res) => {
  let query = "SELECT * FROM `media` ";
  query += "WHERE `typeId` = '" + req.body.typeId + "' ";
  query += "AND `path` LIKE '%" + req.body.query + "%' ";
  query += "ORDER BY " + req.body.sortBy + " " + req.body.sortDir;

  await db.sequelize.query(query, {
    raw: true
  }).then(async data => {
    const limit = req.body.limit ? +req.body.limit : 20
    const start = req.body.page ? +req.body.page * limit : 0
    const end = start + limit
    const total = data[0].length
    const pages = Math.ceil(total / limit)
    const items = data[0]
    const totalRows = await Media.findAndCountAll({
      where: {
        typeId: req.body.typeId,
      },
      raw: true
    })

    res.status(201).send({
      items: items.slice(start, end),
      total: total,
      pages: pages,
      totalRows: totalRows.count
    })
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