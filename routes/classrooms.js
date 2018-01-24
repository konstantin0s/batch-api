// routes/classrooms.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Classroom } = require('../models')
const utils = require('../lib/utils')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/classrooms', (req, res, next) => {
      Classroom.find()
        // Newest classrooms first
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
      const newClassroom = {
        userId: req.account._id,
        studentOneId: req.account._id,

      }

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
      const userId = req.account._id.toString()
      const usersIntent = req.body // e.g. { claim: squareIndex }

      Classroom.findById(id)
        .then((classroom) => {
          if (!classroom) { return next() }

          // if (usersIntent.claim || usersIntent.claim === 0) {
          //   const studentId = classroom.studentId.toString()
          //
          //
          //   // your turn?
          //   // const turn = classroom.board.filter((s) => !!s).length % 2
          //   // const hasTurn = (turn === 0 && studentId === userId)
          //
          //   // if (!hasTurn) {
          //   //   const err = new Error('It is not your turn... :/')
          //   //   err.status = 422
          //   //   return next(err)
          //   // }
          //
          //   // square available?
          //   // const squareAvailable = usersIntent.claim >= 0 &&
          //   //   usersIntent.claim < 9 &&
          //   //   !classroom.board[usersIntent.claim]
          //   // if (!squareAvailable) {
          //   //   const err = new Error('That square is already taken lol')
          //   //   err.status = 422
          //   //   return next(err)
          //   // }
          //
          //   // // are you a winner after this?
          //   // const playerSymbol = turn === 0 ? 'o' : 'x'
          //   // classroom.board[usersIntent.claim] = playerSymbol
          //
          //   // is it a draw after this?
          //   //etc.
          // }

          Classroom.findByIdAndUpdate(id, { $set: classroom }, { new: true })
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
