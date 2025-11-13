const Course = require('../models/Course');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const Notification = require('../models/Notification');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const {
      category,
      level,
      search,
      tutorId,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (tutorId) query.tutorId = tutorId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const courses = await Course.find(query)
      .populate('tutorId', 'name email avatarUrl verifiedTutor')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('tutorId', 'name email avatarUrl bio verifiedTutor')
      .populate('enrolledStudents.studentId', 'name avatarUrl')
      .populate('ratings.studentId', 'name avatarUrl');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    if (req.user) {
      isEnrolled = course.enrolledStudents.some(
        e => e.studentId._id.toString() === req.user.id
      );
    }

    res.status(200).json({
      success: true,
      data: course,
      isEnrolled
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Tutor only)
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      currency,
      category,
      level,
      syllabus,
      maxStudents,
      startDate,
      endDate,
      tags,
      thumbnail
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description'
      });
    }

    // Create course
    const course = await Course.create({
      title,
      description,
      tutorId: req.user.id,
      price: price || 0,
      currency: currency || 'NGN',
      category,
      level,
      syllabus,
      maxStudents,
      startDate,
      endDate,
      tags,
      thumbnail
    });

    // Create course group chat
    const chatRoom = await ChatRoom.create({
      name: `${title} - Group Chat`,
      type: 'course',
      courseId: course._id,
      participants: [
        {
          userId: req.user.id,
          role: 'admin'
        }
      ]
    });

    // Update course with group ID
    course.groupId = chatRoom._id;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Tutor who created it)
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.tutorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    // Update course
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Tutor who created it or Admin)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.tutorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
exports.enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.some(
      e => e.studentId.toString() === req.user.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Check max students
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Course is full'
      });
    }

    // If course is paid, return payment details
    if (course.price > 0) {
      return res.status(200).json({
        success: true,
        requiresPayment: true,
        amount: course.price,
        currency: course.currency,
        message: 'Please complete payment to enroll'
      });
    }

    // Enroll student (free course)
    course.enrolledStudents.push({
      studentId: req.user.id,
      enrolledAt: Date.now(),
      progress: 0
    });

    await course.save();

    // Add to user's enrolled courses
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledCourses: course._id }
    });

    // Add to course group
    await ChatRoom.findByIdAndUpdate(course.groupId, {
      $addToSet: {
        participants: {
          userId: req.user.id,
          role: 'member'
        }
      }
    });

    // Create notification
    await Notification.create({
      userId: req.user.id,
      type: 'course_enrollment',
      title: 'Course Enrollment Successful',
      message: `You have successfully enrolled in ${course.title}`,
      metadata: { courseId: course._id }
    });

    res.status(200).json({
      success: true,
      message: 'Enrolled successfully',
      data: course
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// @desc    Get course schedule
// @route   GET /api/courses/:id/schedule
// @access  Private (Enrolled students or tutor)
exports.getCourseSchedule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('title schedule tutorId enrolledStudents')
      .populate('tutorId', 'name');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check authorization
    const isEnrolled = course.enrolledStudents.some(
      e => e.studentId.toString() === req.user.id
    );
    const isTutor = course.tutorId && course.tutorId._id.toString() === req.user.id;

    if (!isEnrolled && !isTutor && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this schedule'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        courseTitle: course.title,
        schedule: course.schedule
      }
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedule',
      error: error.message
    });
  }
};

// @desc    Add rating/review to course
// @route   POST /api/courses/:id/rating
// @access  Private (Enrolled students only)
exports.addRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if enrolled
    const isEnrolled = course.enrolledStudents.some(
      e => e.studentId.toString() === req.user.id
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled to rate this course'
      });
    }

    // Check if already rated
    const existingRating = course.ratings.find(
      r => r.studentId.toString() === req.user.id
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      course.ratings.push({
        studentId: req.user.id,
        rating,
        review
      });
    }

    course.calculateAverageRating();
    await course.save();

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      averageRating: course.averageRating
    });
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    });
  }
};
