// handle login and signup
function getLoginPage(res, res) {
    res.json({
        message: 'This is the login page'
    })
}

function getSignUpPage(res, res) {
    res.json({
        message: 'This is the signup page'
    })
}

function createNewUser(res, res) {
    res.json({
        message: 'You have created a new user'
    })
}

function loginExistingUser(res, res) {
    res.json({
        message: 'You have logged in as an existing user'
    })
}

module.exports = {
    getLoginPage,
    getSignUpPage,
    createNewUser,
    loginExistingUser
}