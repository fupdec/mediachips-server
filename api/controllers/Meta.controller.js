const fs = require("fs")
const path = require('path')

module.exports = function (db) {
  // Create and Save a new Meta
  const create = function (req, res) {
    db.Meta.create(req.body, {
        include: [db.MetaSetting, db.PageSetting],
        raw: true
      })
      .then(async data => {
        const m = data.dataValues
        if (m.type == 'array') {
          const userfiles = path.join(__dirname, '../../userfiles')
          const metaFolder = path.join(userfiles, `media/meta/${m.id}`, );
          if (!fs.existsSync(metaFolder)) fs.mkdirSync(metaFolder);

          const [cf, isC] = await db.SavedFilter.findOrCreate({
            where: {
              name: null,
              metaId: m.id
            }
          })

          if (isC) {
            await db.PageSetting.update({
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
  }

  // Retrieve all Metas from the database.
  const findAll = function (req, res) {
    db.Meta.findAll({
        include: {
          model: db.MetaSetting
        }
      })
      .then(data => {
        res.status(201).send(data)
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while performing query."
        })
      })
  }

  // Find a single Meta with an id
  const findOne = function (req, res) {
    db.Meta.findOne({
        where: {
          id: req.params.id
        },
        include: {
          model: db.MetaSetting
        },
      })
      .then(data => {
        res.status(201).send(data)
      }).catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while performing query."
        })
      })
  }

  // Find a single Meta with an id
  const findLatest = function (req, res) {
    db.Meta.findAll({
        limit: 1,
        include: {
          model: db.MetaSetting
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
  }

  // Update a Meta by the id in the request
  const update = function (req, res) {
    db.Meta
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
  }

  // Delete a Meta with the specified id in the request
  const deleteOne = function (req, res) {
    db.Meta
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
  }

  return {
    create,
    findAll,
    findOne,
    findLatest,
    update,
    deleteOne
  }
}