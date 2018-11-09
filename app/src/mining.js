var $ = require('jquery')
var logger = require('../config/winston')
var launcher = require('../src/models/miners/launcher')
var session = require('../src/models/auth/session')
var mbServer = require('../src/models/web/mb-server')
var view = require('../src/views/mining-view')
var timerEvents = require('../src/models/runtime/timer-events')
var fs = require('fs')
var notifier = require('node-notifier')

var id = session.getCredits().id
var minerClosedProperly = false

view.setStartButtonHandler(launch)
view.setBackButtonHandler(goBack)
view.setLogButtonHandler(() => { view.showLogs() })
timerEvents.startRequestingUserCmd(id, launch, shutdown)

$(document).ready(()=>launch())  // TODO: remove it

function launch() {
    if(!session.isAuthed()){
        logger.error('mining.start button click: not authed')
        return  // callback auth: fail
    }

    logger.info('starting mining')

    // callback auth: success

    $('#start-btn').prop('disabled', true)
    $('#main-message').html('Getting settings...')

    mbServer.requestSettings(id, (err, response) => {
        if(err){
            $('#main-message').html('Getting settings failed')
            $('#start-btn').prop('disabled', false)
            return
        }

        if(response.code != 200){
            logger.error('mining.start: request settings failed')
            $('#main-message').html('Getting settings failed')
        }
        logger.debug('mining: respose is ' + JSON.stringify(response))

        // callback settings: success
        $('#main-message').html('Launching...')
        $('#text-box').html('')
        $('#start-btn').off('click')


        launcher.runMiner(response.receivedSettings, (err, progress) => {
            if(err){
                logger.error('error: ' + err)
                return
            }     
            
            if(progress.status == 'download'){
                view.setDownloadProgress(progress.state)
            }
            else if(progress.status == 'starting'){
                view.startDownloader()
            }
            else if(progress.status == 'downloaded'){
                view.showUnpacking()
            }
            else if(progress.status == 'done'){
                view.finishDownloader()
            }

        }, onMessageFromMiner)
    })
}

function shutdown(){
    minerClosedProperly = true
    launcher.killMiner()
    onShutdown()
}

function onShutdown(){
    timerEvents.stopRequestingMinerApi()
    timerEvents.stopParsingMinerLogs()
    timerEvents.startRequestingUserCmd(id, launch, shutdown)
    view.setMinerStopped()
}

function onLogMessage(lines){
    lines.forEach((line) => {
        $('#text-box').append(line + '<br/>')
    })
}

function onLaunch(msg){
    // cleanup log file
    minerClosedProperly = false
    fs.writeFile(msg, '', () => {})  // TODO: make it more pretty

    // passing launch and shutdown handler to make it able to launch miner in usual way
    timerEvents.startRequestingMinerApi(launch, shutdown)  
    timerEvents.startParsingMinerLogs(msg, onLogMessage)
    timerEvents.stopRequestingUserCmd()
    view.setMinerStarted()
    view.setStartButtonHandler(shutdown)
}

function goBack(){
    shutdown()
    window.location = 'auth.html'
}

function showMinerCrashNotification(){
    notifier.notify ({
        title: 'Minerboard warning',
        message: 'Miner has crashed',
        icon: '../static/logos/minerboard.ico',
        sound: true,
     }, function (err, response) {
        // Response is response from notification
     });
}

function onMessageFromMiner(msg){
    // TODO: remove stdout cause useless
    if(msg.event == 'stdout'){
        $('#text-box').append(' : ' + msg.msg)
    }
    else if(msg.event == 'stderr'){
        $('#text-box').append('[ERROR] ' + msg.msg)
    }
    // *********************************
    else if(msg.event == 'exit'){
        if(!minerClosedProperly){
            onMinerCrash()
        }
        onShutdown()
        //showExitNotification()
    }
    else if(msg.event = 'launched'){
        onLaunch(msg.msg)
    }
}

function onMinerCrash(){
    showMinerCrashNotification()
    $('#text-box').css('background-color', 'darkred')
    setTimeout(launch, 10000)
}