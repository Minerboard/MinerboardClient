/**
 * Checks whether token is 10-char hex-only
 * @param {string} token 
 */
function isCorrectToken(token){
    var pattern = /^[0-9a-fA-F]{10}$/
    return pattern.test(token)
}

/**
 * Checks whether name is alpha-numeric and has correct length
 * @param {string} name 
 */
function isCorrectName(name){
    var pattern = /^[0-9a-zA-Z]{3,20}$/
    return pattern.test(name)
}

module.exports = {
    isCorrectToken: isCorrectToken,
    isCorrectName: isCorrectName
}