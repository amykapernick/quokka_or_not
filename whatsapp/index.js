require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    image = context.req.body.MediaUrl0

    context.log(image)
    context.log(context.req.body)
    
    message.body(
        `Welcome to Quokkabot!\n
        ${image}`
    )

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};