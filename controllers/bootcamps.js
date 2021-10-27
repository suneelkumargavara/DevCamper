const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../mideleware/async')
const ErrorResponse = require('../utils/errorResponse')
const geoCoder = require('../utils/geocoder')

// @desc   Get call bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copying req.query
  const reqQuery = {...req.query}

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit']

  // Loop over removeFields and delete them from query
  removeFields.forEach(param => delete reqQuery[param])

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  query = Bootcamp.find(JSON.parse(queryStr))

  if(req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields)
  }

  if(req.query.sort) {
    const soryBy = req.query.sort.split(',').join(' ')
    query = query.sort(soryBy)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagintion
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 100
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)
 
  // Excecute query
  const bootcamps = await query;

  // Pagination result
  const pagination = {}

  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  } 

  if(startIndex > 0) {
    pagination.prev = {
      page: page - 1
    }
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps, pagination })
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

// @desc Get bootcamps within a radius
// @route /api/v1/bootcamps/radius/:zipcode/:distance/:
// @access Private
exports.getBootCampsInRadius = asyncHandler(async(req, res, next) => {
  const {  zipcode, distance  } = req.params

  // Get lat/lng from geocoder
  const loc  = await geoCoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Calc radius using radians
  // Devide dist by radius of earth
  // Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 3963
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  })

  res.status(200).json({
    success: true,
    bootcamps,
    count: bootcamps.length
  })
})