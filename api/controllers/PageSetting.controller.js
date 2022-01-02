const db = require("../index.js");
const {
  PageSetting
} = require("../index.js");
const Op = db.Sequelize.Op;

// Find a single option with a name in the request
exports.findOne = (req, res) => {
  PageSetting.findOne({
    where: {
      metaId: req.query.metaId || null,
      typeId: req.query.typeId || null
    }
  }).then(async (data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};

// Update a single option with a name and value in the request
exports.update = (req, res) => {
  const {
    metaId,
    typeId
  } = req.query

  let where = {}  
  if (metaId) where.metaId = metaId
  else if (typeId) where.typeId = typeId

  PageSetting.update({
    [req.body.option]: req.body.value
  }, {
    where: where
  }).then((data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};