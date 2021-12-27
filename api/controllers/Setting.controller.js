const db = require("../index.js");
const Setting = db.Setting;
const Op = db.Sequelize.Op;

// Find a single option with a name in the request
exports.findOne = (req, res) => {
  Setting.findOne({
    where: {
      option: req.query.option
    },
    raw: true
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
  if (!req.body) return res.sendStatus(400)

  Setting.update({
    value: req.body.value
  }, {
    where: {
      option: req.body.option
    },
  }).then((data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};