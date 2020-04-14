require('dotenv').config()

module.exports = async function (context, req) {
    const res = context.res,
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message()

    message.body(`Welcome to Quokkabot! I'm on Twitch!`)

    res.set('content-type', 'text/xml')
    res.end(message.toString())
};