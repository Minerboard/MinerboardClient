var minerApi = require('../miners/api-manager')
var jsonCreator = require('../data/json-creator')
var mbServer = require('../web/mb-server')

function processStats(callback){  // with miner
    minerApi.getStats((err, stats) => {
        if(err){
            callback(err, null)
            return
        }

        logger.debug('stats from miner: ' + JSON.stringify(stats))

        var rigName = session.getCredits().name
        var id = session.getCredits().id

        var statString = jsonCreator.getStatString(stats.result, rigName)
        
        mbServer.sendStats(statString, id, (result) => {
            if(result.code != 200){
                logger.silly('process stats response: ' + result.message)
                callback(JSON.parse(result.message), null)
                return
            }
            callback(null, result.receivedSettings)
        })
    })
}

module.exports = { processStats }