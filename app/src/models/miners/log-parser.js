var logger = require('../../../config/winston')
var readLastLines = require('read-last-lines')

var lastTimestamp = ''
var startFrom = process.platform == 'win32' ? 17 : 21

function getNewLogs(logPath, callback){
    var lastNotEmptyIndex
    readLastLines.read(logPath, 25)
	.then((singleLine) => {
        var lines = singleLine.split('\n')
        var resultLines = []
        for(var i=lines.length-1; i>=0; i--){  // 18 pos
            if(lines[i].length < 12)
                continue

            if(lastNotEmptyIndex === undefined)
                lastNotEmptyIndex = i

            var timestamp = lines[i].substring(0, 12)
            if(timestamp > lastTimestamp){
                resultLines.push(makePretty(lines[i].substring(startFrom).trim()))
            }
        }
        if(lastNotEmptyIndex !== undefined)
            lastTimestamp = lines[lastNotEmptyIndex].substring(0, 12)
        callback(resultLines.reverse())
    })
}

const styles = {
    green: ['CUDA Driver', 'GPU', 'Total'],
    red: ['ETH: Share'],
    teal: ['ETH - Total', 'ETH: GPU'],
    yellow: ['SC']
}

function makePretty(line){
    if(line.startsWith('�')){
        for(var i=0; i<line.length; i++)
            line = line.replace('�', '#')
    }

    for(var color in styles){   
        for(var i=0; i<color.length; i++){
            if(line.startsWith(styles[color][i])){
                var result = '<font color="' + color + '">' + line + '</font>'
                return result
            }
        }
    }

    return line
}

module.exports = { getNewLogs }

/* styles[color].forEach((pattern) => {
    if(line.startsWith(pattern)){
        var result = '<font color="' + color + '">' + line + '</font>'
        //var result = `<font color="${color}">${line}</font>`
        logger.debug(result)
        return result
    }
}) */