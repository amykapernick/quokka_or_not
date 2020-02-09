require('dotenv').config()

module.exports = async function (context) {
    const res = context.res,
    bodyParser = require('body-parser'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    image = context.req.body

    context.log(image.match(/MediaUrl0=((\w|\d|\%|-|\.)+)&/))
    
    message.body(
        `Welcome to Quokkabot!\n
        ${image.match(/MediaUrl0=((\w|\d|\%|-|\.)+)&/)}`
    )

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};