require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body)
    
    message.body(
        `Welcome to Quokkabot!\n
        ${body.MediaUrl0}`
    )

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};