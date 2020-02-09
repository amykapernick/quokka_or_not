require('dotenv').config()

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const res = context.res, bodyParser = require('body-parser'),
	accountSid = process.env.ACCOUNT_SID,
	authToken = process.env.AUTH_TOKEN,
    client = require('twilio')(accountSid, authToken),
    MessagingResponse = require('twilio').twiml.MessagingResponse,
    twiml = new MessagingResponse()
    message = twiml.message()

    console.log(res)
    
    message.body(`This is a quokka`)
    message.media(`https://quokkas.amyskapers.dev/img/quokka_(1).jpg`)

    // res.writeHead(200, { 'Content-Type': 'text/xml' })
    res.set('content-type', 'text/xml')
	res.end(message.toString())
};