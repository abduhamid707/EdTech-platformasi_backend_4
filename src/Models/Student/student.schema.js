import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: { type: Number, default: 0 },
  totalLessons: { type: Number, required: true }
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: [progressSchema],
  createdAt: { type: Date, default: Date.now },
});

studentSchema.methods.calculateProgress = function (courseId) {
  const progressData = this.progress.find((p) => p.course.toString() === courseId.toString());
  if (!progressData) return 0;
  return ((progressData.completedLessons / progressData.totalLessons) * 100).toFixed(2);
};

export default mongoose.model('Student', studentSchema)
