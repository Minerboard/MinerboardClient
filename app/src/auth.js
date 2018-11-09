var $ = require('jquery')
var logger = require('../config/winston')
var validator = require('../src/models/auth/validator')
var minerBoard = require('../src/models/web/mb-server')
var session = require('../src/models/auth/session')
var startup = require('../src/models/settings/startup')
var view = require('../src/views/auth-view')
var remote = require('electron').remote

startup.addToStartup()
view.init(validateFields)
view.setRegButtonHandler(register)

checkAuth()

logger.info('app runs')

function validateFields(){
    var token = view.getToken()
    var name = view.getName()

    var isNameCorrect = false
    var isTokenCorrect = false

    if(name.length > 0){
        isNameCorrect = validator.isCorrectName(name)
        view.setNameCorrect(isNameCorrect)
    }
    if(token.length > 0){
        isTokenCorrect = validator.isCorrectToken(token)
        view.setTokenCorrect(isTokenCorrect)
    }
        
    var registerAllowed = isNameCorrect && isTokenCorrect
    view.setRegisterBtnEnabled(registerAllowed)
}

function checkAuth(){
    if(session.isAuthed()){
        var token = session.getCredits().token
        var name = session.getCredits().name

        view.setAuthed(token, name)
        view.setRegButtonHandler(() => {
            window.location = 'mining.html'
        })
        view.setLogoutBtnHandler(logout)

        if(remote.getGlobal('runtime').isJustStarted == true){
            remote.getGlobal('runtime').isJustStarted = false
            $('#register-btn').click()  // TODO: remove this
        }
    }
    else if(session.canRestore()){
        remote.getGlobal('runtime').isJustStarted = false
        view.setCanRestore(restore)
    }
}

function onRegistrationSuccess(name, token, id){
    session.register(name, token, id)
    view.setRegistered()

    view.setRegButtonHandler(() => {
        window.location = 'mining.html'
    })

    setTimeout(() => {  // TODO: remove this
        $('#register-btn').click()  
    }, 2000)
}

function logout(){
    session.logout()
    view.setLoggedOut()
    view.setLogoutBtnHandler(restore)
    view.setRegButtonHandler(register)
}

function restore(){
    session.restore()
    var token = session.getCredits().token
    var name = session.getCredits().name
    view.setRestored(token, name)
    view.setLogoutBtnHandler(logout)
    view.setRegButtonHandler(() => {
        window.location = 'mining.html'
    })
}

function register(){
    view.setRegisterInProgress()

    var token = view.getToken()
    var name = view.getName()

    minerBoard.sendRegistrationRequest(name, token, (result) => {
        logger.debug('registration-result: ' + JSON.stringify(result))

        if(result.code == 200){
            onRegistrationSuccess(name, token, result.receivedId)
        }
        else{
            view.setRegisterFailed(result.message.replace('Token', 'Key'))
        }
    })
}