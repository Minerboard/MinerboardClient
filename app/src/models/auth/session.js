var logger = require('../../../config/winston')
var authFile = require('../data/auth-file')

var credits
loadCredits()
logger.debug('credits from file: ' + JSON.stringify(credits))

function loadCredits(){
    credits = authFile.loadCredits()
}

function getCredits(){
    if(!credits){
        logger.warn('session: credits requested but not authed')
    }
    return credits
}

function authenticate(cred){
    credits = cred
    authFile.writeCredits(cred)
}

function isAuthed(){
    return !!credits
}

function logout(){
    authFile.cancelAuthFile()
    credits = undefined
}

function restore(){
    authFile.restore()
    loadCredits()
}

function canRestore(){
    return authFile.canRestore()
}

function register(name, token, id){
    var json = {
        name: name,
        token: token,
        id: id,
        timestamp: 0
    }

    authenticate(json)
}

module.exports = { getCredits, authenticate, isAuthed, logout, restore, canRestore, register }