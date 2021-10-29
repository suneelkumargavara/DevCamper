const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../mideleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geoCoder = require('../utils/geocoder');

// @desc   Get call bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    ...res.advancedResults,
  });
});
// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp });
  } else {
    next(new ErrorResponse(`Bootcamp not found with id ${res.params.id}`, 404));
  }
});

// @desc Create a single bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc Update a single bootcamp
// @route PUT /api/v1/bootcamp/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp });
  } else {
    next(
      new ErrorResponse(
        `Failed to update bootcamp with id ${req.params.id}`,
        404
      )
    );
  }
});

// @desc Delete a single bootcamp
// @route /api/v1/bootcamp/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    next(
      new ErrorResponse(
        `Failed to delete bootcamp with id ${req.params.id}`,
        404
      )
    );
  }
  bootcamp.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance/:
// @access Private
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geoCoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Devide dist by radius of earth
  // Earth radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res.status(200).json({
    success: true,
    bootcamps,
    count: bootcamps.length,
  });
});

// @desc Upload a photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found with id ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create Custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      status: true,
      data: file.name,
    });
  });
});
