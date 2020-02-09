require('dotenv').config()

module.exports = async function (context, req) {
    const res = context.res,
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    image = req.body.MediaUrl0
    
    message.body(`Welcome to Quokkabot!\n ${image}`)

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};