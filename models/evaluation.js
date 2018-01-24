const mongoose = require('../config/database')
const { Schema } = mongoose

const evaluationSchema = new Schema({
  date: { type: Date, default: Date.now, required: true },
  color: { type: String, default: 'yellow', required: true },
  // remark: { type: String },
  student_id: { type: Schema.Types.ObjectId, ref: 'students' }
})

module.exports = mongoose.model('evaluations', evaluationSchema)
