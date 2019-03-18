require('dotenv').config();

const { AuthorizationV1 } = require('watson-developer-cloud');
const auth = new AuthorizationV1({
    username: process.env.SPEECH_TO_TEXT_USERNAME,
    password: process.env.SPEECH_TO_TEXT_PASSWORD,
    url: process.env.SPEECH_TO_TEXT_URL,
})

module.exports = auth;