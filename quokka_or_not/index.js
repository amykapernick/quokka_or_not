module.exports = async function (context, req, res) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const bodyParser = require('body-parser'),
	accountSid = process.env.ACCOUNT_SID,
	authToken = process.env.AUTH_TOKEN,
    client = require('twilio')(accountSid, authToken),
    MessagingResponse = client.twiml.MessagingResponse,
    twiml = new MessagingResponse()
    message = twiml.message()
    
    message.body(`This is a quokka`)
    message.media(`https://quokkas.amyskapers.dev/img/quokka_(1).jpg`)

    res.send('Welcome to quokkabot')

    res.writeHead(200, { 'Content-Type': 'text/xml' })
	res.end(message.toString())
};