const mongoose = require('../config/database')
const { Schema } = mongoose

const evaluationSchema = new Schema({
  date: { type: Date, default: Date.now, required: true },
  color: { type: String, required: true },
  remark: { type: String },
  studentId: { type: Schema.Types.ObjectId, ref: 'students' }
})

module.exports = mongoose.model('evaluations', evaluationSchema)
