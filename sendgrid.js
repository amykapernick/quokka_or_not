require("dotenv").config();

const sendEmail = ({email, body, subject, image, plain}) => {
	const sgMail = require('@sendgrid/mail')

	sgMail.setApiKey(process.env.SENDGRID_API_KEY)

	let msg = {
		to: email,
		from: {
			name: 'Quokkabot',
			email: 'quokkas@amyskapers.dev'
		},
		subject: subject,
		html: body
	}

	sgMail.send(msg)
}

module.exports = {
	sendEmail
}