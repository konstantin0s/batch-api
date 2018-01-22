// models/classroom.js
const mongoose = require('../config/database')
const { Schema } = mongoose

const classroomSchema = new Schema({

 batchNo: { type: String, required: true },
 startAt: { type: Date, default: Date.now },
 EnddAt: { type: Date, default: Date.now },


  studentId: [{ type: Schema.Types.ObjectId, ref: 'students' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('classrooms', classroomSchema)
