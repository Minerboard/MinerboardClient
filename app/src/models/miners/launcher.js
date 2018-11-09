var logger = require('../../../config/winston')
var appRoot = require('../runtime/path').getPath()
var fs = require('fs')
var spawn = require('child_process').spawn
var getLaunchArgs = require('./launch-args').getLaunchArgs
var downloader = require('../web/downloader')

const logFolder = `${appRoot}/logs`

const minerDirs = {
    ClaymoresDualEthereum: 'eth_miner',
    ClaymoresEthereum: 'eth_miner',
    ClaymoresZCashAMD: 'zec_miner',
    ClaymoresCryptoNoteAMD: 'cn_miner'
}

const miners = {
    win32: {
        ClaymoresDualEthereum: 'EthDcrMiner64.exe',
        ClaymoresEthereum: 'EthDcrMiner64.exe',
        ClaymoresZCashAMD: 'ZecMiner64.exe',
        ClaymoresCryptoNoteAMD: 'NsGpuCNMiner.exe'
    },

    linux: {
        ClaymoresDualEthereum: 'ethdcrminer64',
        ClaymoresEthereum: 'ethdcrminer64',
        ClaymoresZCashAMD: 'zecminer64',
        ClaymoresCryptoNoteAMD: 'nsgpucnminer'
    },

    darwin: {
        ClaymoresDualEthereum: 'ethdcrminer64',
        ClaymoresEthereum: 'ethdcrminer64',
        ClaymoresZCashAMD: 'zecminer64',
        ClaymoresCryptoNoteAMD: 'nsgpucnminer'
    }
}

var slash = process.platform == 'win32' ? '\\' : '/'
var minerProcess

/**
 * Launches miner specified in settings and with arguments from settings
 * @param {object} settings JSON settings reveived from server
 * @returns {string} status message
 */
function runMiner(settings, callback, outputCb){
    logger.debug('settings at launcher: ' + JSON.stringify(settings))

    var minerName = settings.miner.name
    if(!(minerName in miners.win32)){
        logger.error('launcher: unknown miner in received settings: ' + minerName)
        return
    }

    if (!fs.existsSync(logFolder)){
        fs.mkdirSync(logFolder)
    }

    var currentMiner = appRoot + slash + minerDirs[minerName] + slash + miners[process.platform][minerName]
    
    var launchCmd = currentMiner
    var launchArgs = getLaunchArgs(settings, logFolder)
    
    logger.debug('launch cmd:\n' + launchCmd)
    logger.debug('laucnh args:\n' + JSON.stringify(launchArgs))

    var makeLaunch = () => {
        executeCmd(launchCmd, launchArgs, outputCb)
    }

    if(!fs.existsSync(currentMiner)){
        callback(null, { status: 'starting' })
        downloader.downloadMiner(minerDirs[minerName], (err, progress) => {
            if(!err && progress.status == 'done'){
                callback(null, progress)
                prepareExecutable(launchCmd)
                makeLaunch()
                return
            }
            else{
                callback(err, progress)
            }
        })
    }
    else{
        makeLaunch()
    }
}

function prepareExecutable(exePath){
    if(process.platform != 'linux')
        return

    spawn('chmod', ['+x', exePath])
    logger.debug('made chmod +x ' + exePath)
}

function executeCmd(cmd, args, outputCb){
    minerProcess = spawn(cmd, args)

    logger.debug('log: ' + args[1])

    outputCb({
        event: 'launched',
        msg: args[1]  // TODO: miner logname here
    })

    //callback()

    minerProcess.stdout.on('error', (err) => {
        logger.debug('stdout error: ' + err)
    })

    minerProcess.stdout.on('data', (data) => {
        logger.debug('stdout: ' + data.toString())
        outputCb({
            event: 'stdout',
            msg: data.toString()
        })
    })

    minerProcess.on('error', (err) => {
        logger.debug('ERR: ' + err.toString())
    })

    minerProcess.stderr.on('data', (data) => {
        outputCb({
            event: 'stderr',
            msg: data.toString()
        })
    })

    minerProcess.on('exit', () => {
        logger.info('miner closed')
        outputCb({
            event: 'exit',
            msg: null
        })
    })

    minerProcess.on('close', () => {
        outputCb({
            event: 'exit',
            msg: null
        })
    })
    
    minerProcess.on('disconnect', () => {
        logger.debug('miner disconnected')
        outputCb({
            event: 'exit',
            msg: null
        })
    })
}

function killMiner(){
    minerProcess.kill()
}

module.exports = { runMiner, killMiner }