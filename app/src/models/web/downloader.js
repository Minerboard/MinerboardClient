var logger = require('../../../config/winston')
var progress = require('request-progress')
var fs = require('fs')
var request = require('request')
var extract = require('extract-zip')
var appRoot = require('../runtime/path').getPath()


var slash = process.platform == 'win32' ? '\\' : '/'
const tmpFilePath = appRoot + slash + '.tmp.zip'

var minerLinks = {
    win32: {
        "eth_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/Claymore_Ethereum.zip",
        "zec_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/Claymore_Zcash.zip",
        "cn_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/Claymore_Cryptonote.zip"    
    },

    linux: {
        "eth_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/linux/Claymore's+Dual+Ethereum.zip",
        "zec_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/linux/Claymore's+ZCash.zip",
        "cn_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/linux/Claymore's+CryptoNote.zip"    
    },

    darwin: {
        "eth_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/linux/Claymore's+Dual+Ethereum.zip",
        "zec_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/linux/Claymore's+ZCash.zip",
        "cn_miner": "https://s3.eu-central-1.amazonaws.com/minerboard.storage/linux/Claymore's+CryptoNote.zip"    
    }
}

function downloadMiner(minerName, callback){
    var targetDirectory = appRoot + slash + minerName

    if(fs.existsSync(targetDirectory)){
        logger.debug(targetDirectory + ' already exists. download skipped')
        callback(null, -1)
    }

    var url = minerLinks[process.platform][minerName]

    logger.debug('download url: ' + url)
    logger.debug('target directory: ' + targetDirectory)

    downloadFile(url, tmpFilePath, (err, progress) => {
        if(progress.status == 'downloaded'){  // download done
            unpack(tmpFilePath, targetDirectory, (err) => {
                logger.silly('removing ' + tmpFilePath)
                fs.unlinkSync(tmpFilePath)
                if(err){
                    logger.error('miner unpack failed: ' + err)
                    callback(err, null)
                    return
                }

                callback(null, {
                    status: 'done'
                })
            })
        }
        else{
            callback(err, progress)
        }
    })
}

function downloadFile(url, dest, callback){
    progress(request(url))
    .on('progress', downloadState => {
        callback(null, {
            status: 'download',
            state: Math.floor(downloadState.percent*1000) / 1000
        })
    })
    .on('error', err => {
        logger.error('error while downloading: ' + err)
        callback(err, null)
        return
    })
    .on('end', () => {
        logger.info('download complete')
        callback(null, {
            status: 'downloaded',
            state: 1
        })
    })
    .pipe(fs.createWriteStream(dest))
}

function unpack(src, dest, callback){
    extract(src, {dir: dest}, (err) => {
        callback(err)
    })
}


module.exports = { downloadMiner }