const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../mideleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc   Get call bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find()
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps })
})
// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp })
  } else {
    next(new ErrorResponse(`Bootcamp not found with id ${res.params.id}`, 404))
  }
})

// @desc Create a single bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({ success: true, data: bootcamp })
})

// @desc Update a single bootcamp
// @route PUT /api/v1/bootcamp/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp })
  } else {
    next(
      new ErrorResponse(
        `Failed to update bootcamp with id ${req.params.id}`,
        404,
      ),
    )
  }
})

// @desc Delete a single bootcamp
// @route /api/v1/bootcamp/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  if (bootcamp) {
    res.status(200).json({ success: true, data: {} })
  } else {
    next(
      new ErrorResponse(
        `Failed to delete bootcamp with id ${req.params.id}`,
        404,
      ),
    )
  }
})
