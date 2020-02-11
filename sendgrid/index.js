require('dotenv').config()


module.exports = async function (context) {
    const req = context.req,
    multipart = require('parse-multipart'),
    bodyBuffer = Buffer.from(req.body),
    // fs = require('file-system')
    // qs = require('querystring'),
    // MessagingResponse = require('twilio').twiml.MessagingResponse,
    // twiml = new MessagingResponse(),
    // message = twiml.message(),
    // body = qs.parse(context.req.body)
    // boundary = ,
    boundary = multipart.getBoundary(req.headers['content-type']),
    body = multipart.Parse(bodyBuffer, boundary)
    // body = multipart.Parse(body)
    // text = body.Body,
    // image = body.NumMedia && body.MediaUrl0

    // if(image) {
    //     const results = await customVision(image),
    //     reply = whatsappReply(results)
        
    //     message.body(reply.message)

    //     if(reply.photo) {
    //         message.media(`https://quokkas.amyskapers.dev/img/quokka_(${reply.photo}).jpg`)
    //     }
    // }
    // else {
    //     const results = quokkaBot.quokkaBot(text)

    //     message.body(results.body)
    //     message.media(results.media)
    // }

    context.log(body)

    // res.set('content-type', 'text/xml')
	// res.end(message.toString())
};

