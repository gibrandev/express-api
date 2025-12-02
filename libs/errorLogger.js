import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const errorTransport = new DailyRotateFile({
    dirname: "logs/errors",         // folder khusus error
    filename: "error-%DATE%.log",   // rotating file
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d"                 // simpan 30 hari
});

export const errorLogger = winston.createLogger({
    level: "error",                 // HANYA simpan error
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        errorTransport,
        new winston.transports.Console({ level: "error" })
    ]
});
