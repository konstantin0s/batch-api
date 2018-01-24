// models/classroom.js
const mongoose = require('../config/database')
const { Schema } = mongoose

const studentSchema = new Schema({

 fullName: { type: String, required: true },
 pic: { type: String },
 classroomId: { type: Schema.Types.ObjectId, ref: 'classrooms' },


});

module.exports = mongoose.model('students', studentSchema)
