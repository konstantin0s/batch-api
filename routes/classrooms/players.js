// routes/classrooms.js
const router = require('express').Router()
const passport = require('../../config/auth')
const { Classroom, User } = require('../../models')

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

const getPlayers = (req, res, next) => {
  Promise.all([req.classroom.playerOneId, req.classroom.playerTwoId].map(playerId => User.findById(playerId)))
    .then((users) => {
      // Combine player data and user's name
      req.players = users
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
    .get('/classrooms/:id/players', loadClassroom, getPlayers, (req, res, next) => {
      if (!req.classroom || !req.players) { return next() }
      res.json(req.players)
    })

    .post('/classrooms/:id/players', authenticate, loadClassroom, (req, res, next) => {
      if (!req.classroom) { return next() }

      const userId = req.account._id
      const { playerOneId, playerTwoId } = req.classroom

      const isPlayerOne = playerOneId && playerOneId.toString() === userId.toString()
      const isPlayerTwo = playerTwoId && playerTwoId.toString() === userId.toString()

      if (isPlayerOne || isPlayerTwo) {
        const error = Error.new('You already joined this classroom!')
        error.status = 401
        return next(error)
      }

      if (!!playerOneId && !!playerTwoId) {
        const error = Error.new('Sorry classroom is full!')
        error.status = 401
        return next(error)
      }

      // Add the user to the players
      if (!playerOneId) req.classroom.playerOneId = userId
      if (!playerTwoId) req.classroom.playerTwoId = userId

      req.classroom.save()
        .then((classroom) => {
          req.classroom = classroom
          next()
        })
        .catch((error) => next(error))
    },
    // Fetch new player data
    getPlayers,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'CLASSROOM_PLAYERS_UPDATED',
        payload: {
          classroom: req.classroom,
          players: req.players
        }
      })
      res.json(req.players)
    })

    .delete('/classrooms/:id/players', authenticate, (req, res, next) => {
      if (!req.classroom) { return next() }

      const userId = req.account._id
      const { playerOneId, playerTwoId } = req.classroom

      const isPlayerOne = playerOneId.toString() === userId.toString()
      const isPlayerTwo = playerTwoId.toString() === userId.toString()

      if (!isPlayerOne || !isPlayerTwo) {
        const error = Error.new('You are not a player in this classroom!')
        error.status = 401
        return next(error)
      }

      // Add the user to the players
      if (isPlayerOne) req.classroom.playerOneId = null
      if (isPlayerTwo) req.classroom.playerTwoId = null

      req.classroom.save()
        .then((classroom) => {
          req.classroom = classroom
          next()
        })
        .catch((error) => next(error))

    },
    // Fetch new player data
    getPlayers,
    // Respond with new player data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'CLASSROOM_PLAYERS_UPDATED',
        payload: {
          classroom: req.classroom,
          players: req.players
        }
      })
      res.json(req.players)
    })

  return router
}
