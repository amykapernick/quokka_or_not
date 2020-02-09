require('dotenv').config()

const qs = require('querystring'),
MessagingResponse = require('twilio').twiml.MessagingResponse

module.exports = async function (context) {
    const res = context.res,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body)
    // image = body.MediaUrl0

    context.log(body)
    context.log(body.MediaUrl0)
    
    message.body(
        `Welcome to Quokkabot!\n
        ${body}`
    )

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};