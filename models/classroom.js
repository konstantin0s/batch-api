const mongoose = require('../config/database')
const { Schema } = mongoose

const classroomSchema = new Schema({
  batchNr: { type: String, required: true },
  startAt: { type: Date, default: Date.now },
  endAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('classrooms', classroomSchema)
