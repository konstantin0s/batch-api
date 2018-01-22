// models/classroom.js
const mongoose = require('../config/database')
const { Schema } = mongoose

const studentSchema = new Schema({

 classroomId: { type: Schema.Types.ObjectId, ref: 'classrooms' },
 fullName: { type: String, required: true },
 photo: { type: String },
 
 evaluationDay: { type: [] },
 evaluationDate: { type: Date, default: Date.now },
 color: { type: String, default: 'orange' },
 remark: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('students', studentSchema)
