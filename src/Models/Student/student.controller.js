import courseSchema from '../Course/course.schema.js'
import Student from '../Student/student.schema.js'

class StudentController {
  // 📌 1. Talaba yaratish
  static async createStudent(req, res, next) {
    try {
      const student = new Student(req.body)
      await student.save()
      res.status(201).json(student)
    } catch (error) {
      next(error)
    }
  }

  // 📌 2. Barcha talabalarni olish
  static async getStudents(req, res) {
    try {
      const students = await Student.find().populate('enrolledCourses')
      res.status(200).json(students)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
  static async getStudentProgress (req, res) {
    try {
      const { id } = req.params;
      const { courseId } = req.query; 
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ message: 'O‘quvchi topilmadi' });
      const progress = student.calculateProgress(courseId);
      res.json({ student: student.name, courseId, progress: `${progress}%` });
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
  static async updateStudentProgress(req, res) {
    try {
      const { id } = req.params;
      const { courseId } = req.query;
      const { completedLessons, totalLessons } = req.body;
  
      const student = await Student.findById(id);
      if (!student) return res.status(404).json({ message: 'O‘quvchi topilmadi' });
  
      const progressIndex = student.progress.findIndex((p) => p.course.toString() === courseId.toString());
  
      if (progressIndex !== -1) {
        student.progress[progressIndex].completedLessons = completedLessons;
        student.progress[progressIndex].totalLessons = totalLessons;
      } else {
        student.progress.push({ course: courseId, completedLessons, totalLessons });
      }
  
      await student.save();
      
      const progress = student.calculateProgress(courseId);
      
      return res.json({ 
        message: 'O‘quvchi progressi yangilandi', 
        student: student.name, 
        courseId, 
        progress: `${progress}%`
      });
  
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  // 📌 3. Talabani yangilash
  static async updateStudent(req, res) {
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      if (!student)
        return res.status(404).json({ message: 'Student not found' })
      res.status(200).json(student)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // 📌 4. Talabani o‘chirish
  static async deleteStudent(req, res) {
    try {
      const student = await Student.findByIdAndDelete(req.params.id)
      if (!student)
        return res.status(404).json({ message: 'Student not found' })
      res.status(200).json({ message: 'Student deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
  // 📌 5. Kursga yozilish
  static async enrollInCourse(req, res) {
    try {
      const student = await Student.findById(req.params.studentId)
      if (!student)
        return res.status(404).json({ message: 'Student not found' })

      const course = await courseSchema.findById(req.params.courseId)
      if (!course) return res.status(404).json({ message: 'Course not found' })

      student.enrolledCourses.push(course._id)
      await student.save()

      res.status(200).json({ message: 'Enrolled successfully', student })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default StudentController
