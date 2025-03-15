import express from 'express'
import CourseController from './course.controller.js'
import authMiddleware from '../../middleware/auth.mddl.js'

const router = express.Router()

// Barcha menyu elementlarini olish
router.get('/', CourseController.getCourses)

// ID bo'yicha menyu elementini olish
router.get('/:id', CourseController.getCourseById)

// Yangi menyu elementi yaratish
router.post('/', authMiddleware, CourseController.createCourse)

// Menyu elementini yangilash
router.put('/:id', CourseController.updateCourse)

// Menyu elementini o'chirish
router.delete('/:id', CourseController.deleteCourse)

export default router
