import  courseSchema  from "./course.schema.js";

class CourseController {
    // 📌 1. Kurs yaratish
    static async createCourse(req, res,next) {
        try {
            const course = new courseSchema(req.body);
            await course.save();
            res.status(201).json(course);
        } catch (error) {
            next(error);
        }
    }

    // 📌 2. Barcha kurslarni olish
    static async getCourses(req, res) {
        try {
            const courses = await courseSchema.find();
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 📌 3. Bitta kursni olish
    static async getCourseById(req, res) {
        try {
            const course = await courseSchema.findById(req.params.id);
            if (!course) return res.status(404).json({ message: 'Course not found' });
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 📌 4. Kursni yangilash
    static async updateCourse(req, res) {
        try {
            const course = await courseSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!course) return res.status(404).json({ message: 'Course not found' });
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // 📌 5. Kursni o‘chirish
    static async deleteCourse(req, res) {
        try {
            const course = await courseSchema.findByIdAndDelete(req.params.id);
            if (!course) return res.status(404).json({ message: 'Course not found' });
            res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default CourseController;