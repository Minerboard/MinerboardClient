var { remote } = require ('electron')
var path = require('path')   

function getPath(){
    return path.dirname(remote.process.execPath)
}

module.exports = { getPath }