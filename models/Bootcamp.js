const mongoose = require('mongoose')
const slugify = require('slugify')
const geoCoder = require('../utils/geocoder')

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [500, 'Description cannnot be more than 500 characters'],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      ,
      'Please use a valid URL with HTTP or HTTPS',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer thatn 20 characters'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      ,
      'Please enter valid email',
    ],
  },
  address: {
    type: String,
    required: [true, 'Please add a address'],
  },
  location: {
    // GeoJSON point
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formatterAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must cannot be more than 10'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no_photo.jpg',
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Create bootcamp slug from the schema
BootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next()
})

// Geocode and create location field
BootcampSchema.pre('save', async function(next) {
  const loc = await geoCoder.geocode(this.address)
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formatterAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].state,
    zipcode: loc[0].zipcode,
    street: loc[0].countryCode
  }
  next()
})

module.exports = mongoose.model('Bootcamp', BootcampSchema)
