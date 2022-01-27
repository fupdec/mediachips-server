const {
  Meta,
  MetaSetting,
  PageSetting,
  SavedFilter
} = require("../index.js");
const fs = require("fs")
const path = require('path')

// Create and Save a new Meta
exports.create = (req, res) => {
  Meta.create(req.body, {
      include: [MetaSetting, PageSetting],
      raw: true
    })
    .then(async data => {
      const m = data.dataValues
      if (m.type == 'array') {
        const userfiles = path.join(__dirname, '../../userfiles')
        const metaFolder = path.join(userfiles, `media/meta/${m.id}`, );
        if (!fs.existsSync(metaFolder)) fs.mkdirSync(metaFolder);

        const [cf, isC] = await SavedFilter.findOrCreate({
          where: {
            name: null,
            metaId: m.id
          }
        })

        if (isC) {
          await PageSetting.update({
            filterId: cf.id
          }, {
            where: {
              metaId: m.id
            }
          })
        }
      }

      res.status(201).send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Retrieve all Metas from the database.
exports.findAll = (req, res) => {
  Meta.findAll({
      include: {
        model: MetaSetting
      }
    })
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single Meta with an id
exports.findOne = (req, res) => {
  Meta.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: MetaSetting
      },
    })
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Find a single Meta with an id
exports.findLatest = (req, res) => {
  Meta.findAll({
      limit: 1,
      include: {
        model: MetaSetting
      },
      order: [
        ['createdAt', 'DESC']
      ]
    })
    .then(data => {
      res.status(201).send(data)
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Update a Meta by the id in the request
exports.update = (req, res) => {
  Meta
    .update(req.body, {
      where: {
        id: parseInt(req.params.id)
      }
    })
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete a Meta with the specified id in the request
exports.delete = (req, res) => {
  Meta
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(() => {
      const userfiles = path.join(__dirname, '../../userfiles')
      const dir = path.join(userfiles, 'media/meta', req.params.id)
      fs.rmSync(dir, {
        recursive: true,
        force: true
      })
      res.sendStatus(201)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while performing query."
      })
    })
};

// Delete all Metas from the database.
exports.deleteAll = (req, res) => {};