var $ = require('jquery')

function init(fieldValidator){
    $('#logout-btn').hide()
    $('#token-input').on('input', fieldValidator)
    $('#name-input').on('input', fieldValidator)
    $('#register-btn').prop('disabled', true)
    $('#alert').hide()
}

function setAuthed(token, name){
    // change texts
    $('#main-message').html('Welcome back!')
    $('#register-btn').html('Go to mining')
    $('#logout-btn').show()
    // lock inputs
    $('#name-input').val(name)
    $('#token-input').val(token)
    $('#name-input').prop('disabled', true)
    $('#token-input').prop('disabled', true)
    // center input text
    $('#name-input').prop('style', 'text-align: center')
    $('#token-input').prop('style', 'text-align: center')
    // enable button
    $('#register-btn').prop('disabled', false)
    // show succes alert
    showAlert('success', 'Succesfuly logged in. Let\'s go ahead')
}

function setRegistered(){
    showAlert('success', 'Registered successfully')
    $('#register-btn').html('Next')
    $('#register-btn').prop('disabled', false)
    $('#logout-btn').hide()
    $('#name-input').prop('disabled', true)  // lock input on success
    $('#token-input').prop('disabled', true)
}

function setRegisterFailed(msg){
    showAlert('danger', msg)
    $('#register-btn').prop('disabled', false)
    $('#register-btn').html('Register')
}

function setRegisterInProgress(){
    $('#register-btn').prop('disabled', true)
    $('#register-btn').html('Sending...')
}

function setLoggedOut(restoreHandler){
    // messages
    showAlert('warning', 'Logged out. Please log in again to continue')
    $('#main-message').html('Enter token and unique hardware name')
    // unlock inputs
    $('#name-input').val('')
    $('#token-input').val('')
    $('#name-input').prop('disabled', false)
    $('#token-input').prop('disabled', false)
    // uncenter input text
    $('#name-input').prop('style', 'text-align: left')
    $('#token-input').prop('style', 'text-align: left')
    $('#register-btn').html('Register')

    setCanRestore(restoreHandler)    
}

function getToken(){
    return $('#token-input').val().toUpperCase()
}

function getName(){
    return $('#name-input').val()
}

function setCanRestore(restoreHandler){
    $('#logout-btn').html('Restore')
    $('#logout-btn').show()
    setLogoutBtnHandler(restoreHandler)
}

function setRestored(token, name){
    $('#logout-btn').html('Logout')
    setAuthed(token, name)
}

function showAlert(state, message){
    if(state == 'success'){
        $('#alert').removeClass('alert-warning')
        $('#alert').removeClass('alert-danger')
        $('#alert').addClass('alert-success')
    }
    else if(state == 'danger'){
        $('#alert').removeClass('alert-warning')
        $('#alert').removeClass('alert-success')
        $('#alert').addClass('alert-danger')
    }
    else if(state == 'warning'){
        $('#alert').removeClass('alert-success')
        $('#alert').removeClass('alert-danger')
        $('#alert').addClass('alert-warning')
    }

    $('#alert').html(message)
    $('#alert').show(50)
}

function setRegButtonHandler(handler){
    $('#register-btn').off('click')
    $('#register-btn').click(handler)
}

function setLogoutBtnHandler(handler){
    $('#logout-btn').off('click')
    $('#logout-btn').click(handler)
}

function setNameCorrect(correct){
    if(correct)
        $('#name-input').removeClass('is-invalid')
    else
        $('#name-input').addClass('is-invalid')
}

function setTokenCorrect(correct){
    if(correct)
        $('#token-input').removeClass('is-invalid')
    else
        $('#token-input').addClass('is-invalid')
}

function setRegisterBtnEnabled(enabled){
    $('#register-btn').prop('disabled', !enabled)
}

module.exports = { setAuthed, showAlert, setRegButtonHandler, setLogoutBtnHandler,
     setLoggedOut, setCanRestore, setRestored, setRegistered, setRegisterFailed,
     setRegisterInProgress, getToken, getName, init, setRegisterBtnEnabled,
     setNameCorrect, setTokenCorrect }