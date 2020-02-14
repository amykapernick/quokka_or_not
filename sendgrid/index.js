require('dotenv').config()

const quokkaTest = require('../quokka-test'),
customVision = quokkaTest.customVisionBinary,
quokkabot = require('../quokkabot')

const emailReply = (outcome) => {
    let message,
    photo = Math.floor(Math.random() * 12),
    quokka = `${(outcome[1] * 100).toFixed(2)}%`,
        notQuokka = `${(outcome[0] * 100).toFixed(2)}%`
        
    if (outcome[0] > outcome[1]) {
        message = `<p>Sorry, doesn't look like that's a quokka 😢</p>
        <dl><dt>Quokka:</dt> <dd>${quokka}</dd> <dt>Not Quokka:</dt> <dd>${notQuokka}</dd></dl>
        <p>That's pretty sad though, so here's a quokka</p>
        <p><img src="https://quokkas.amyskapers.dev/img/quokka_(${photo}).jpg" /></p>`
    } else {
        message = `<p>Yep, that looks like a quokka!</p>
        <dl><dt>Quokka:</dt> <dd>${quokka}</dd> <dt>Not Quokka:</dt> <dd>${notQuokka}</dd></dl>`
    }

    return message
}

module.exports = async function (context) {
    context.log('sendgrid function')

    const req = context.req,
    multipart = require('../parse-multipart/multipart.js'),
    fs = require('file-system'),
    bodyBuffer = Buffer.from(req.body),
    boundary = multipart.getBoundary(req.headers['content-type'])
    let body = {},
    image,
    reply = {}
    
    multipart.Parse(bodyBuffer, boundary).forEach(o => {
        if(o.name) {
            body[o.name] = o.data
        }
        else if(o.filename) {
            body.filename = o.data
        }

        if(o.filename) {
            image = o.data
        }
    })

    const email = body.from,
    message = body.text

    if(image) {
        const results = await customVision(image)

        reply.html = emailReply(results)
    }
    else {
        reply.html = quokkabot.email(message)
    }


    const msg = {  
        to: email,
        from: {
			name: 'Quokkabot',
			email: 'quokkas@amyskapers.dev'
		},
        html: reply.html,
        subject: `Re: ${body.subject}`,
    }


    const sgMail = require('@sendgrid/mail')

	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

	await sgMail.send(msg)
};

