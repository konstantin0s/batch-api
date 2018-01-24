// models/classroom.js
const mongoose = require('../config/database')
const { Schema } = mongoose

const classroomSchema = new Schema({

 batchNo: { type: String, required: true },
 startAt: { type: Date, default: Date.now },
 endAt: { type: Date, default: Date.now }

});




module.exports = mongoose.model('classrooms', classroomSchema)

//
// const mongoose = require('../config/database')
// const { Schema } = mongoose
//
// const evaluationSchema = new Schema({
//   color: { type: Number },
//   remark: { type: String },
//   authorName:  { type: String },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });
//
// const studentSchema  = new Schema({
//   batchNo: { type: Number },
//   fullName: { type: String, required: true },
//   photo: { type: String, required: true },
//   evaluations:[evaluationSchema],
// });
//
// const classroomSchema = new Schema({
//   classNr: { type: Number, required: true, unique: true },
//   students: [studentSchema],
//   startAt: { type: Date, required: true },
//   endAt: { type: Date, required: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });
//
//



//
// module.exports = mongoose.model('classroom', classroomSchema)
