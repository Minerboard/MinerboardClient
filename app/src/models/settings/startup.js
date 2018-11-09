var appRoot = require('../runtime/path').getPath()

function addToStartup(){
    if(process.platform == 'win32'){
        var ws = require('windows-shortcuts');
        ws.create("%APPDATA%/Microsoft/Windows/Start Menu/Programs/Startup/Minerboard.lnk", appRoot + '\\minerboard.exe');
    }
    else if(process.platform == 'linux'){
        // TODO: add startup for linux
    }
}

module.exports = { addToStartup }

