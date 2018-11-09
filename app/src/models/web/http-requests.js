var request = require('request')
var logger = require('../../../config/winston')


/**
 * 
 * @param {string} url Url to send request
 * @param {string} json Registration json string 
 * @param {} callback Callback?
 */
function sendJson(url, json, callback){
    var options = {
        uri: url,
        method: 'POST',
        body: json
    }

    request(options, (error, response, body) => {
        if(error){
            if(!response){
                callback('No connection to server', null)
                return
            }
            var statusCode = response.statusCode || 'unknown'
            logger.error(`Error: ${error} StatusCode: ${statusCode}`)
        }

        logger.info('received response from server:\n' + JSON.stringify(response, null, 2))
        callback(null, response)
    })
}

function getResponse(url, callback){
    request(url, function (error, response, body) {
        if(error){
            var statusCode = response ? response.statusCode : 'unknown'
            logger.error(`Error: ${error} StatusCode: ${statusCode}`)
            callback(error, response)
            return
        }

        //logger.info('received response from server:\n' + JSON.stringify(response, null, 2))
        callback(null, response)
    }); 
}

module.exports = { sendJson, getResponse }