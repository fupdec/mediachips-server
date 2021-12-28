const db = require("../index.js");
const {
  Meta,
  ValuesInItem
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  ValuesInItem.findAll({
    where: {
      itemId: req.query.itemId
    },
    raw: true
  }).then(async (data) => {
    let result = []
    for (let val of data) {
      const foundMeta = await Meta.findByPk(val.metaId, {
        raw: true,
      })
      if (foundMeta) {
        val = {
          ...val,
          ...{
            meta: foundMeta
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

// Find a single Tutorial with an id
exports.findOne = (req, res) => {};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {};