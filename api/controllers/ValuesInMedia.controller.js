const db = require("../index.js");
const {
  Meta,
  ValuesInMedia
} = require("../index.js");
const Op = db.Sequelize.Op;

// Create and Save a new ValuesInMedia
exports.create = (req, res) => {};

// Retrieve all ValuesInMedia from the database.
exports.findAll = (req, res) => {
  if (!req.body) return res.sendStatus(400)

  ValuesInMedia.findAll({
    where: {
      mediaId: req.query.mediaId
    },
    raw: true
  }).then(async (data) => {
    let result = []
    for (let val of data) {
      const foundMeta = await Meta.findByPk(val.mediaId, {
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

// Find a single ValuesInMedia with an id
exports.findOne = (req, res) => {};

// Update a ValuesInMedia by the id in the request
exports.update = (req, res) => {};

// Delete a ValuesInMedia with the specified id in the request
exports.delete = (req, res) => {};

// Delete all ValuesInMedia from the database.
exports.deleteAll = (req, res) => {};