const db = require("../index.js");
const Item = db.Item;
const Op = db.Sequelize.Op;

// Create and Save a new Item
exports.create = (req, res) => {};

// Retrieve all Item from the database.
exports.findAll = async (req, res) => {
  let query = "SELECT * FROM `items` AS `item` ";
  query += "WHERE `item`.`metaId` = '" + req.query.metaId + "' ";
  query += "AND `item`.`name` LIKE '%" + req.query.search + "%' ";
  query += "ORDER BY 'name'";

  await db.sequelize.query(query, {
    raw: true
  }).then(async data => {
    const limit = req.query.limit ? +req.query.limit : 20
    const start = req.query.page ? +req.query.page * limit : 0
    const end = start + limit
    const total = data[0].length
    const pages = Math.ceil(total / limit)
    const items = data[0]
    const totalRows = await Item.findAndCountAll({
      where: {
        metaId: req.query.metaId,
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