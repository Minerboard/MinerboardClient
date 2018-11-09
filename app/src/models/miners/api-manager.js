var net = require('net')

function getStats(callback){
    var port = 3333; //The same port that the server is listening on
    var host = '127.0.0.1';

    var request = {
        id: 0,
        jsonrpc: "2.0",
        method: "miner_getstat1"
    }

    var client = new net.Socket();
    client.connect(port, host, () => {
        client.write(JSON.stringify(request));
    })

    client.on('data', function(data) {
        logger.debug('Received: ' + data);
        client.destroy();
        callback(null, JSON.parse(data))
    })

    client.on('error', (err) => {
        //logger.debug('api error: ' + err)
        callback('no connection from miner', null)
    })
}

module.exports = { getStats }