require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse()
    message = twiml.message()
    
    message.body(`Welcome to Quokkabot!`)

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};