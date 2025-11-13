const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseSchedule,
  addRating
} = require('../controllers/courseController');
const { protect, authorize, verifiedTutorOnly, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, getCourses);
router.get('/:id', optionalAuth, getCourse);

// Protected routes - Tutor only
router.post('/', protect, authorize('tutor', 'admin'), verifiedTutorOnly, createCourse);
router.put('/:id', protect, authorize('tutor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('tutor', 'admin'), deleteCourse);

// Protected routes - Student
router.post('/:id/enroll', protect, enrollInCourse);
router.get('/:id/schedule', protect, getCourseSchedule);
router.post('/:id/rating', protect, authorize('student'), addRating);

module.exports = router;
