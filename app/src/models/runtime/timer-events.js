var logger = require('../../../config/winston')
var statsManager = require('./stats-manager')
var userCommands = require('./user-commands')
var logParser = require('../miners/log-parser')
var mbServer = require('../web/mb-server')

let minerApiTimer
let minerLogsTimer
let userCmdTimer

const minerApiInterval = 5000
const minerLogsInterval = 1000
const userCmdInterval = 4000

var attempts = 0

function startRequestingMinerApi(launchHandler, shutdownHandler){
    minerApiTimer = setInterval(() => {
        statsManager.processStats((err, settings) => {
            if(err){
                if(attempts++ > 2 || err != 'no connection from miner'){
                    logger.debug('timer-events.no cmd handle: ' + err)
                }
                return
            }

            userCommands.handleUserCommands(settings, launchHandler, shutdownHandler)
        })
    }, minerApiInterval)
}

function stopRequestingMinerApi(){
    window.clearInterval(minerApiTimer)
}

function startParsingMinerLogs(logPath, callback){
    minerLogsTimer = setInterval(() => {
        logParser.getNewLogs(logPath, callback)  // TODO: redo this
    }, minerLogsInterval)
}

function stopParsingMinerLogs(){
    window.clearInterval(minerLogsTimer)
}

function startRequestingUserCmd(id, launchHandler, shutdownHandler){
    userCmdTimer = setInterval(() => {
        mbServer.requestSettings(id, (err, result) => {
            if(err){
                logger.warning('could not process user cmd: ' + err)
                return
            }

            userCommands.handleUserCommands(result.receivedSettings, launchHandler, shutdownHandler)
        })
    }, userCmdInterval)
}

function stopRequestingUserCmd(){
    window.clearInterval(userCmdTimer)
}

module.exports = { startRequestingMinerApi, stopRequestingMinerApi,
                   startParsingMinerLogs, stopParsingMinerLogs, 
                   startRequestingUserCmd, stopRequestingUserCmd }