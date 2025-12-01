const express = require('express')
const app = express()
const cors = require('cors')


import apiRoutes from './routes/api.js'

const port = 3000

app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use("/api", apiRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
