var appRoot = require('../src/models/runtime/path').getPath()
var winston = require('winston')
const { combine, timestamp, label, printf } = winston.format;
var fs = require('fs')


const logDir = 'logs';
if (!fs.existsSync(`${appRoot}/${logDir}`)) {
  fs.mkdirSync(`${appRoot}/${logDir}`);
}

var options = {
    file: {
        filename: `${appRoot}/${logDir}/app.log`,
        handleExceptions: false,
        maxsize: 5242880,  // 5 MB
        colorize: false,
        level: 'silly',
        json: false
    }
}

const myFormat = printf(info => {
    return `[${info.timestamp}] (${info.level}): ${info.message}`;
  });

var logger = winston.createLogger({
    format: combine(
        timestamp({format: 'HH:mm:ss'}),  // 'YYYY-MM-DD HH:ss:mm'
        myFormat
    ),

    transports: [
        new winston.transports.File(options.file)
    ],
    exitOnError: false  // do not exit on handled exceptions
})

module.exports = logger

