const db = require("../index.js");
const ItemsInItems = db.ItemsInItems;
const Items = db.Items;
const Meta = db.Meta;
const Op = db.Sequelize.Op;

// Create and Save a new ItemsInItems
exports.create = (req, res) => {};

// Retrieve all ItemsInItemss from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  ItemsInItems.findAll({
    where: {
      itemId: req.query.itemId
    },
    include: [{
      model: Items,
      attributes: ['name', 'color', 'metaId'],
    }],
    raw: true
  }).then(async (data) => {
    let result = []
    for (let val of data) {
      const foundMeta = await Meta.findByPk(val['Item.metaId'], {
        raw: true,
      })
      if (foundMeta) {
        val = {
          ...val,
          ...{
            Meta: foundMeta
          }
        }
        result.push(val)
      }
    }
    res.status(201).send(result)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while performing query."
    })
  })
};

// Find a single ItemsInItems with an id
exports.findOne = (req, res) => {};

// Update a ItemsInItems by the id in the request
exports.update = (req, res) => {};

// Delete a ItemsInItems with the specified id in the request
exports.delete = (req, res) => {};

// Delete all ItemsInItemss from the database.
exports.deleteAll = (req, res) => {};