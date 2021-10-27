const express = require('express')

const {
  getBootcamps,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  createBootcamp,
  getBootCampsInRadius
} = require('../controllers/bootcamps')

// Include other resourse routers
const courseRouter = require('./courses')

const router = express.Router()

// Re route into other resourse
router.use('/:bootcampId/courses', courseRouter)


router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

router.route('/radius/:zipcode/:distance').get(getBootCampsInRadius)

module.exports = router
