var fs = require('fs')
var appRoot = require('../runtime/path').getPath()
var logger = require('../../../config/winston')

const authFilePath = `${appRoot}/auth.json`
const oldAuthFilePath = `${appRoot}/auth-old.json`

/**
 * Saves data to file in JSON format
 * @param {object} data raw JSON object to write
 */
function writeCredits(data){
    var strData = JSON.stringify(data)
    logger.debug(`Writing data to ${authFilePath}:\n${strData}`)
    fs.writeFileSync(authFilePath, strData)
}

/**
 * @returns {object} JSON data 
 */
function loadCredits(){
    if(!fs.existsSync(authFilePath)){
        logger.info('auth file: file not found')
        return null
    }
    return JSON.parse(fs.readFileSync(authFilePath).toString())
}

function cancelAuthFile(){
    if(fs.existsSync(oldAuthFilePath)){
        fs.unlinkSync(oldAuthFilePath)
    }

    if(fs.existsSync(authFilePath)){
        fs.renameSync(authFilePath, oldAuthFilePath)
    }
}

function restore(){
    if(fs.existsSync(authFilePath)){
        fs.unlinkSync(authFilePath)
    }

    if(fs.existsSync(oldAuthFilePath)){
        fs.renameSync(oldAuthFilePath, authFilePath)
    }
}

function canRestore(){
    return fs.existsSync(oldAuthFilePath)
}

module.exports = { writeCredits, loadCredits, cancelAuthFile, restore, canRestore }