const router = require('express').Router()
const passport = require('../config/auth')
const { Classroom } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/classrooms', (req, res, next) => {
      Classroom.find()
        // Newest batches first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((classrooms) => res.json(classrooms))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/classrooms/:id', (req, res, next) => {
      const id = req.params.id

      Classroom.findById(id)
        .then((classroom) => {
          if (!classroom) { return next() }
          res.json(classroom)
        })
        .catch((error) => next(error))
    })
    .post('/classrooms', authenticate, (req, res, next) => {
      const newClassroom = req.body


      Classroom.create(newClassroom)
        .then((classroom) => {
          io.emit('action', {
            type: 'CLASSROOM_CREATED',
            payload: classroom
          })
          res.json(classroom)
        })
        .catch((error) => next(error))
    })
    .put('/classrooms/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const updatedClassroom = req.body

      Classroom.findByIdAndUpdate(id, { $set: updatedClassroom }, { new: true })
        .then((classroom) => {
          io.emit('action', {
            type: 'CLASSROOM_UPDATED',
            payload: classroom
          })
          res.json(classroom)
        })
        .catch((error) => next(error))
    })
    .patch('/classrooms/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const patchForClassroom = req.body

      Classroom.findById(id)
        .then((classroom) => {
          if (!classroom) { return next() }

          const updatedClassroom = { ...classroom, ...patchForClassroom }

          Classroom.findByIdAndUpdate(id, { $set: updatedClassroom }, { new: true })
            .then((classroom) => {
              io.emit('action', {
                type: 'CLASSROOM_UPDATED',
                payload: classroom
              })
              res.json(classroom)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/classrooms/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Classroom.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'CLASSROOM_REMOVED',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
