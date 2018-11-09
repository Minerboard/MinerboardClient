var spawn = require('child_process').spawn

var cmd = {
    linux: 'reboot',
    win32: 'shutdown -r',
    darwin: 'shutdown -r now "Minerboard: rebooting"'
}

function reboot(){
    spawn(cmd[process.platform], [], { 'shell': true})
}

module.exports = { reboot }