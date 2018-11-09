var req = require('./http-requests')
var jsonCreator = require('../data/json-creator')

var logger = require('../../../config/winston')

/**
 * Sends registration info to minerboard server
 * @param {string} name rig name
 * @param {string} token registration token
 */
function sendRegistrationRequest(name, token, callback){
    var regString = jsonCreator.getRegistrationString(name)
    var regLink = 'https://app.minerboard.com/api/hardware/' + token

    logger.debug(`Registration link: ${regLink}`)
    logger.debug(`Registration json string: ${regString}`)

    req.sendJson(regLink, regString, (err, response) => {
        if(err){
            var result = {
                code: 400,
                message: err,
                receivedId: null
            }

            callback(result)
            return
        }

        if(!response){
            logger.error('mb-server.Registration: 400. Bad request. Server not found')

            var result = {
                code: 400,
                message: 'Bad request. Server not found',
                receivedId: null
            }

            callback(result)
            return
        }

        var statusCode = response.statusCode
        
        if(statusCode != 200){
            var result = {
                code: statusCode,
                message: JSON.parse(response.body).error,
                receivedId: null
            }

            callback(result)
            return
        }
        
        var result = {
            code: statusCode,
            message: 'OK',
            receivedId: JSON.parse(response.body).id
        }

        callback(result)
    })
}

function sendStats(statString, id, callback){
    var url = 'https://app.minerboard.com/api/hardware/' + id + '/statistics';
    logger.debug('sending stats to url: ' + url)
    logger.silly('json string to send:\n' + statString)
    

    req.sendJson(url, statString, (err, response) => {
        if(!response){
            logger.error('mb-server.Sending stats: 400. Bad request. Server not found')

            var result = {
                code: 400,
                message: 'Bad request. Server not found',
                receivedSettings: null
            }

            callback(result)
            return
        }

        var statusCode = response.statusCode
        
        if(statusCode != 200){
            var result = {
                code: statusCode,
                message: response.body.message,
                receivedSettings: null
            }

            callback(result)
            return
        }
        
        logger.silly('settings: ' + response.body)
        var result = {
            code: statusCode,
            message: 'OK',
            receivedSettings: JSON.parse(response.body)
        }

        callback(result)
    })
}

function requestSettings(id, callback){
    var url = 'https://app.minerboard.com/api/hardware/' + id + '/settings';
    logger.debug('requesting settings at url: ' + url)

    req.getResponse(url, (err, response) => {
        if(err){
            callback(err, response)
            return
        }

        if(!response){
            logger.error('mb-server.Request settings: 400. Bad request. Server not found')

            var result = {
                code: 400,
                message: 'Bad request. Server not found',
                receivedSettings: null
            }

            callback(err, result)
            return
        }

        var statusCode = response.statusCode
        
        if(statusCode != 200){
            var result = {
                code: statusCode,
                message: response.body.error,
                receivedSettings: null
            }

            callback(err, result)
            return
        }
        
        var result = {
            code: statusCode,
            message: 'OK',
            receivedSettings: JSON.parse(response.body)
        }

        callback(err, result)
    })
}

module.exports = { sendRegistrationRequest, sendStats, requestSettings }