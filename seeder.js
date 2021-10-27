const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotEnv = require('dotenv')

// Load Env Vars
dotEnv.config({path: "./config/config.env"})

//Load Models
const Bootcamp = require('./models/Bootcamp')

// Conncet DB
mongoose.connect(process.env.MONGO_URI)

// Read JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))

// IMPORT into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log("Data Imported....".green.inverse)
        process.exit()
    } catch(err) {
        console.log('err')
    }
}

// Delete Data

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        console.log("Data Distroyed.....".red.inverse)
        process.exit()
    } catch(err) {
        console.log(err)
    }
}

if(process.argv[2] === "-i") {
    importData()
} else if(process.argv[2] === "-d"){
    deleteData()
}