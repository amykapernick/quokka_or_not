require('dotenv').config()

const quokkaTest = require('../quokka-test').customVision

module.exports = async function (context, req) {
    const res = context.res,
    qs = require('querystring'),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse(),
    message = twiml.message(),
    body = qs.parse(context.req.body),
    image = body.NumMedia && body.MediaUrl0

    const results = await quokkaTest(image)

    context.log(results)


    message.body(`Welcome to Quokkabot! I'm on Twitch!`)

    res.set('content-type', 'text/xml')
    res.end(message.toString())
};