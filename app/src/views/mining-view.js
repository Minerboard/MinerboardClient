var $ = require('jquery')

$('#downloader').hide()
$('#text-box').hide()
$('#log-btn').hide()
$('#back-btn').click(() => {
    window.location = 'auth.html'
})

function setMinerStopped(){
    $('#main-message').html('Miner stopped')
    $('#start-btn').off('click')
    $('#start-btn').html('Start mining')
    $('#start-btn').click(launch)
}

function setMinerStarted(){
    $('#text-box').css('background-color', 'black')
    $('#main-message').html('Mining started!')
    $('#start-btn').html('Stop')
    $('#start-btn').prop('disabled', false)
    $('#log-btn').show(50)
}

function setStartButtonHandler(handler){
    $('#start-btn').off('click')
    $('#start-btn').click(handler)
}

function startDownloader(){
    $('#downloader').show()
    $('#progress-text').show()
    $('#progress-bar').prop('style', 'width: 0%')
    $('#progress-text').html('Downloading miner')
    $('#main-message').html('Downloading miner')
}

function setDownloadProgress(percent){
    percent = Math.floor(percent*1000)/10
    $('#progress-bar').prop('style', `width: ${percent}%`)
    $('#progress-text').html('Downloading miner ' + percent + '%')
}

function finishDownloader(){
    $('#downloader').fadeOut(500)
    $('#main-message').html('Downloaded')
}

function showUnpacking(){
    $('#main-message').html('Unpacking')
    $('#progress-text').html('Unpacking...')
}

function showLogs(){
    $('#logo-text').hide(300)
    $('#mb-logo').animate({'marginLeft': '85%'})
    $('#main-message').animate({'marginTop': '-18.5%'}, 300)
    $('#start-btn').animate({'marginTop': '-2%'}, 300)
    $('#text-box').slideDown(300)
    $('#log-btn').html('Hide miner output')
    setLogButtonHandler(hideLogs)
}

function hideLogs(){
    $('#logo-text').show(300)
    $('#mb-logo').animate({'marginLeft': '0%'})
    $('#main-message').animate({'marginTop': '3%'}, 300)
    $('#start-btn').animate({'marginTop': '0%'}, 300)
    $('#text-box').slideUp(300)
    $('#log-btn').html('Show miner output')
    setLogButtonHandler(showLogs)
}

function setLogButtonHandler(handler){
    $('#log-btn').off('click')
    $('#log-btn').click(handler)
}

function setBackButtonHandler(handler){
    $('#back-btn').off('click')
    $('#back-btn').click(handler)
}

/* function scrollLogsToBottom(){
    var tb = $('#text-box')
    tb.scrollTop = tb.scrollHeight
} */

module.exports = { setMinerStarted, setMinerStopped, setStartButtonHandler, startDownloader,
                   setDownloadProgress, finishDownloader, showUnpacking, /* scrollLogsToBottom */
                   showLogs, setLogButtonHandler, setBackButtonHandler }