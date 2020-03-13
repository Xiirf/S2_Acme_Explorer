'use strict';

var winston = require('winston'),
    path = require('path');;
var logDir = 'logs',
    env = process.env.NODE_ENV || 'development',
    logger;

winston.addColors(winston.config.npm.colors);

logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.align(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${env === 'development' && info.stack ? info.stack : info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            level: 'warn', // Only write logs of warn level or higher
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: env === 'development' ? 'debug' : 'info',
            filename: path.join(__dirname, logDir, '/' + env + '/logs.log'),
            maxsize: 1024 * 1024 * 10 // 10MB
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(__dirname, logDir, '/' + env + '/exceptions.log')
        })
    ],
    exitOnError: false
});

module.exports = logger;