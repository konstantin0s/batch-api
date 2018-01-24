const request = require('superagent')
const user = require('./fixtures/user.json')
const classrooms = require('./fixtures/classrooms.json')
const students = require('./fixtures/students.json')

const createUrl = (path) => {
  return `${process.env.HOST || `http://localhost:${process.env.PORT || 3030}`}${path}`
}


const createClassrooms = (token) => {
  return classrooms.map((classroom) => {
    return request
      .post(createUrl('/classrooms'))
      .set('Authorization', `Bearer ${token}`)
      .send(classroom)
      .then((res) => {
        console.log('Classroom created...', res.body)
      })
      .catch((err) => {
        console.error('Error creating class!', err)
      })
  })
}

const createStudents = (token) => {
  return students.map((student) => {
    return request
      .post(createUrl('/students'))
      .set('Authorization', `Bearer ${token}`)
      .send(student)
      .then((res) => {
        console.log('Student created...', res.body)
      })
      .catch((err) => {
        console.error('Error creating student!', err)
      })
  })
}

const authenticate = (email, password) => {
  request
    .post(createUrl('/sessions'))
    .send({ email, password })
    .then((res) => {
      console.log('Authenticated!')
      // createStudents(res.body.token)
      return createClassrooms(res.body.token)
    })
    .catch((err) => {
      console.error('Failed to authenticate!', err.message)
    })
}

request
  .post(createUrl('/users'))
  .send(user)
  .then((res) => {
    console.log('User  created!')
    return authenticate(user.email, user.password)
  })
  .catch((err) => {
    console.error('Could not create user', err.message)
    console.log('Trying to continue...')
    authenticate(user.email, user.password)
})
