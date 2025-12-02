import "dotenv/config";
const express = require('express')
const app = express()
const cors = require('cors')

import apiRoutes from './routes/api.js'
import { errorLogger } from "#libs/errorLogger.js";

const port = process.env.APP_PORT || 3000  

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", apiRoutes);

// Logging middleware for errors
app.use((err, req, res, next) => {
    errorLogger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });

    return res.status(500).json({
        error: "Internal server error"
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
