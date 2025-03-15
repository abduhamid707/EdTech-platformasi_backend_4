import studentSchema from '../Student/student.schema.js'
class AnalyticsController {
  // 📌 Eng mashhur kurslarni olish
  static async getPopularCourses(req, res) {
    try {
      const popularCourses = await studentSchema.aggregate([
        { $unwind: '$enrolledCourses' },
        {
          $group: {
            _id: '$enrolledCourses',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'courses', // Kurslar kolleksiyasi
            localField: '_id',
            foreignField: '_id',
            as: 'course',
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            title: { $arrayElemAt: ['$course.title', 0] }, // Kurs titleni olish
          },
        },
      ])

      res.status(200).json(popularCourses)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

export default AnalyticsController
