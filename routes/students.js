// routes/classrooms.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Classroom, User } = require('../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadClassroom = (req, res, next) => {
  const id = req.params.id

  Classroom.findById(id)
    .then((classroom) => {
      req.classroom = classroom
      next()
    })
    .catch((error) => next(error))
}

const getStudents = (req, res, next) => {
  Promise.all([req.classroom.studentOneId].map(studentId => User.findById(studentId)))
    .then((users) => {
      // Combine player data and user's name
      req.students = users
        .filter(u => !!u)
        .map(u => ({
          userId: u._id,
          name: u.name
        }))
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router
    .get('/classrooms/:id/students', loadClassroom, getStudents, (req, res, next) => {
      if (!req.classroom || !req.students) { return next() }
      res.json(req.students)
    })

    .post('/classrooms/:id/students', authenticate, loadClassroom, (req, res, next) => {
      if (!req.classroom) { return next() }

      const userId = req.account._id
      const { studentOneId } = req.classroom

      const isStudentOne = studentOneId && studentOneId.toString() === userId.toString()


      if (isStudentOne) {
        const error = Error.new('You already joined this classroom!')
        error.status = 401
        return next(error)
      }

      if (!!studentOneId) {
        const error = Error.new('Sorry classroom is full!')
        error.status = 401
        return next(error)
      }

      // Add the user to the players
      if (!studentOneId) req.classroom.studentOneId = userId


      req.classroom.save()
        .then((classroom) => {
          req.classroom = classroom
          next()
        })
        .catch((error) => next(error))
    },
    // Fetch new player data
    getStudents,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'CLASSROOM_STUDENTS_UPDATED',
        payload: {
          classroom: req.classroom,
          players: req.students
        }
      })
      res.json(req.students)
    })

    .delete('/classrooms/:id/students', authenticate, (req, res, next) => {
      if (!req.classroom) { return next() }

      const userId = req.account._id
      const { studentOneId } = req.classroom

      const isStudentOne = studentOneId.toString() === userId.toString()


      if (!isStudentOne) {
        const error = Error.new('You are not a student in this classroom!')
        error.status = 401
        return next(error)
      }

      // Add the user to the players
      if (isStudentOne) req.classroom.studentOneId = null
      

      req.classroom.save()
        .then((classroom) => {
          req.classroom = classroom
          next()
        })
        .catch((error) => next(error))

    },
    // Fetch new player data
    getStudents,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'CLASSROOM_STUDENTS_UPDATED',
        payload: {
          classroom: req.classroom,
          players: req.students
        }
      })
      res.json(req.students)
    })

  return router
}
