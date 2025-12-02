import "dotenv/config";
const express = require('express')
const app = express()
const cors = require('cors')

import apiRoutes from './routes/api.js'

const port = process.env.APP_PORT || 3000  

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", apiRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
