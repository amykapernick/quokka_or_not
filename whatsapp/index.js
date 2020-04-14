require('dotenv').config()

const quokkaTest = require('../quokka-test').customVision,
quokkaBot = require('../quokkabot').message

const whatsappReply = (outcome) => {
    let message,
    quokka = `${(outcome.quokka * 100).toFixed(2)}%`,
    notQuokka = `${(outcome.negative * 100).toFixed(2)}%`

    if(outcome.quokka > outcome.negative) {
        message = `Yep, that looks like a quokka!
            \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }
    else {
        message = `Sorry, doesn't look like that's a quokka 😢
            \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
    }

    return message
}

module.exports = async function (context, req) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    text = body.Body,
    image = body.NumMedia && body.MediaUrl0

    if(image) {
        const results = await quokkaTest(image),
        reply = whatsappReply(results)

        message.body(reply)
    }
    else {
        const results = quokkaBot(text)

        message.body(results.body)
        message.media(results.media)
    }

    

    res.set('content-type', 'text/xml')
    res.end(message.toString())
};