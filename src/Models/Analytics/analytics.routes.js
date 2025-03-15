import express from 'express';
import analyticsController from './analytics.controller.js';

const router = express.Router();

router.get('/popular-courses', analyticsController.getPopularCourses);

export default router;
