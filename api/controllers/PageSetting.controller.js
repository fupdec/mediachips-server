const {
  PageSetting
} = require("../index.js");

// Create and Save a new SavedFilter
exports.create = (req, res) => {
  PageSetting.findOrCreate({
      where: req.body
    })
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

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
  PageSetting.update(req.body, {
    where: {
      metaId: req.query.metaId || null,
      typeId: req.query.typeId || null
    }
  }).then((data) => {
    res.status(201).send(data)
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving media."
    })
  })
};