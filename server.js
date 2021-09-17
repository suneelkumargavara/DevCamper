const express = require('express')
const dotEnv = require('dotenv')

dotEnv.config({ path: './config/config.env' })

const app = express()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server runnig in ${process.env.PORT}`))
