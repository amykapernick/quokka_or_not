require('dotenv').config()

const quokkaTest = require('../quokka-test'),
customVision = quokkaTest.customVisionBinary,
quokkabot = require('../quokkabot'),
sendgrid = require('../sendgrid')

const emailReply = (outcome) => {
    let message,
    photo = Math.floor(Math.random() * 12),
    quokka = `${(outcome[1] * 100).toFixed(2)}%`,
        notQuokka = `${(outcome[0] * 100).toFixed(2)}%`
        
    if (outcome[0] > outcome[1]) {
        message = `Sorry, doesn't look like that's a quokka 😢
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}
        \nThat's pretty sad though, so here's a quokka`
    } else {
        message = `Yep, that looks like a quokka!
        \nQuokka: ${quokka}, Not Quokka: ${notQuokka}`
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
    message = body.text,
    results = await customVision(image)

    reply.html = emailReply(results)

    context.log(reply.html)

    fs.writeFile(`image.jpg`, image);

    context.log(reply.html)

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

