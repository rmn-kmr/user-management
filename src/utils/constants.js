let userMessage = {
    FIELD_REQUIRED: 'Email and password are required',
    INVALID_EMAIL: 'email field that that must be in the following order: characters@characters.domain (characters followed by an @ sign, followed by more characters, and then a ".". After the "." sign, add at least 2 letters from a to z',
    INVALID_PASSWORD: '8 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter',
    REGISTER_SUCCESS: 'User registered successfully',
    REGISTER_FAILURE: 'User registered un-successfully',
    SIGNIN_SUCCESS: 'Signin succesfully',
    SIGNIN_FAILURE: 'Signin un-succesfully',
}

module.exports = {
    userMessage
}