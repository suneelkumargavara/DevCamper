const express = require('express')
const dotEnv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const errorHandler = require('./mideleware/error')
const connectDB = require('./config/db')

// Load env vars
dotEnv.config({ path: './config/config.env' })

// Connect to DB
connectDB()

//Route files
const bootcamps = require('./routes/bootcamps')

const app = express()

app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () =>
  console.log(`server runnig in ${process.env.PORT}`.yellow.bold),
)

process.on('unhandledRejection', (error, promise) => {
  console.log(`Error: ${error.message}`)
  server.close(() => process.exit(1))
})
