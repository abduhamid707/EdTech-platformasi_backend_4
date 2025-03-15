import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  instructor: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Course', courseSchema)
