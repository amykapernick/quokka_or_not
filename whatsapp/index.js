require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message()

    context.log(context.req.body)
    context.log(context.req.body.Body)
    
    message.body(
        `Welcome to Quokkabot!\n
        ${image}`
    )

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};