import express from 'express'
const router = express.Router()

import Student from './Student/student.routes.js'
import Course from './Course/course.routes.js'
import PopularCourse from './Analytics/analytics.routes.js'
import AiReply from "./AI/ai.routes.js"
router.use('/student', Student)
router.use('/ai-assistant', AiReply)
router.use('/course', Course)
router.use('/analytics', PopularCourse)
export default router
