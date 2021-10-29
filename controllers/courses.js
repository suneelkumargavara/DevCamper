const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../mideleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc Get courses
// @route  GET /api/v1/courses
// @route  GET /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    ...res.advancedResults,
  });
});

// @desc get a single course
// @route GET /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc AddACourse
// @route /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found with id ${req.params.bootcampId}`),
      404
    );
  }
  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    course,
  });
});

// @desc Update Course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id ${req.params.id}`, 404)
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Delete a course
// @route /api/v1/course/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course found with id ${req.params.id}`, 404)
    );
  }
  course = await Course.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
