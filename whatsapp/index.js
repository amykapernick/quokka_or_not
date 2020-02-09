require('dotenv').config()

const quokkaTest = require('../quokka-test'),
customVision = quokkaTest.customVision

const whatsappReply = (results) => {
    let message,
    quokka = `${(outcome[1] * 100).toFixed(2)}%`,
        notQuokka = `${(outcome[0] * 100).toFixed(2)}%`
        
    if (outcome[0] > outcome[1]) {
        message = `Sorry, doesn't look like that's a quokka 😢
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    } else {
        message = `Yep, that looks like a quokka!
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }

    return message
}

module.exports = async function (context) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    image = body.NumMedia && body.MediaUrl0

    const results = await customVision(image),
    message = await whatsappReply(results)
    
    message.body(message)

    res.set('content-type', 'text/xml')
	res.end(message.toString())
};

