var logger = require('../../../config/winston')
var session = require('../auth/session')
var pc = require('../hardware/pc')

function handleUserCommands(settings, launchHandler, shutdownHandler){
    var lastTimestamp = session.getCredits().timestamp
    var currentTimestamp = settings.settings.custom.r_timestamp

    var commandIndex = settings.settings.custom.r
    logger.debug('user commands: command index (r) = ' + commandIndex)
    logger.debug(`user commands: last ts = ${lastTimestamp}, current ts = ${currentTimestamp}`)
    
    if(currentTimestamp <= lastTimestamp){
        logger.debug('user commands: timestamp not updated')
        return
    }

    if(commandIndex == 1){
        launchHandler()
    }
    else if(commandIndex == 2){
        shutdownHandler()
    }
    else if(commandIndex == 3){
        pc.reboot()
    }

    // update timestamp
    var credits = session.getCredits()
    credits.timestamp = currentTimestamp
    session.authenticate(credits)
}


module.exports = { handleUserCommands }