require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    image = body.NumMedia && body.MediaUrl0
    
    message.body(
        `Welcome to Quokkabot!\n
        ${image}`
    )

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};