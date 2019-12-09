require('dotenv').config()

const express = require('express'),
	nunjucks = require('nunjucks'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	PredictionApi = require('@azure/cognitiveservices-customvision-prediction')

const app = express(),
	key = process.env.API_KEY,
	endpoint = 'https://southcentralus.api.cognitive.microsoft.com/',
	publishIterationName = process.env.ITERATION,
	projectId = process.env.PROJECT_ID,
	accountSid = process.env.ACCOUNT_SID,
	authToken = process.env.AUTH_TOKEN,
	client = require('twilio')(accountSid, authToken),
	MessagingResponse = require('twilio').twiml.MessagingResponse,
	service = client.sync.services(process.env.SYNC_SID)

const predictor = new PredictionApi.PredictionAPIClient(key, endpoint),
	testFile = `quokka_test.jpg`

const quokkaReply = outcome => {
	let message = '',
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

const customVision = async image => {
	if (image) {
		return (results = await predictor.classifyImageUrl(projectId, publishIterationName, { url: image }))
	} else {
		return (results = await predictor.classifyImage(projectId, publishIterationName, fs.readFileSync(`./img/${testFile}`)))
	}
}

const quokkaTest = res => {
	let outcome = []

	results.predictions.forEach(tag => {
		if (tag.tagName == 'Negative') {
			outcome[0] = tag.probability
		} else if (tag.tagName == 'Quokka') {
			outcome[1] = tag.probability
		}
	})

	return outcome
}

nunjucks.configure(['views/'], {
	autoescape: true,
	express: app,
})

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/img', express.static('img'))

app.use(express.static('resources'))

app.get('/', async (req, res) => {
	res.render('index.html', {
		title: 'QuokkaBot',
	})
})

app.get('/results', async (req, res) => {
	const quokka = req._parsedUrl.query,
		results = await customVision(quokka)

	let outcome = quokkaTest(results)

	if (outcome[0] > outcome[1]) {
		outcome = false
	} else {
		outcome = true
	}

	res.render('results.html', {
		title: 'QuokkaBot',
		image: quokka,
		outcome: outcome,
		results: results,
	})
})

app.get('/whatsapp', (req, res) => {
	res.render('whatsapp.html', {
		title: 'WhatsApp | Quokkabot',
	})
})

app.post('/sms', async (req, res) => {
	const twiml = new MessagingResponse()

	let request = req.body.Body,
		image = req.body.MediaUrl0,
		message = twiml.message(),
		photo = Math.floor(Math.random() * 12),
		type = 'jpg',
		newQuokka = false

	if (image) {
		let results = await customVision(image),
			outcome = quokkaTest(results),
			quokka = true,
			response = quokkaReply(outcome)

		newQuokka = true

		let quokkaList;
		try {
			quokkaList = await service.syncLists.create({ uniqueName: 'quokkaTests' });
		} catch(e) {
			quokkaList = await service.syncLists('quokkaTests');
		}

		await quokkaList.syncListItems.create({ data: { url: image }});

		if (outcome[0] > outcome[1]) {
			quokka = false
			message.body(response)
			message.media(`https://quokkas.amyskapers.tech/img/quokka_(${photo}).${type}`)
		} else {
			message.body(response)
		}
	} else {
		if (RegExp('quokka', 'i').test(request)) {
			message.body(`This is a quokka`)
			message.media(`https://quokkas.amyskapers.tech/img/quokka_(${photo}).${type}`)

			newQuokka = true
		} else {
			message.body(
				`Welcome to Quokka bot! I can do a bunch of different things that have to do with quokkas.
      \nNeed a picture of a quokka? Just ask me
      \nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`
			)
		}
	}

	if (newQuokka) {
		await service.documents('quokkabot').update({
			data: {
				url: `https://quokkas.amyskapers.tech/img/quokka_(${photo}).${type}`,
			},
		})
	}

	res.writeHead(200, { 'Content-Type': 'text/xml' })
	res.end(message.toString())
})

app.get('/facebook', (req, res) => {
	res.render('facebook.html', {
		title: 'Facebook Messenger | Quokkabot',
	})
})

app.post('/facebook', async (req, res) => {
	const twiml = new MessagingResponse()

	let request = req.body.Body,
		image = req.body.MediaUrl0,
		message = twiml.message()

	if (image) {
		let results = await customVision(image),
			outcome = quokkaTest(results),
			quokka = true,
			response = quokkaReply(outcome)

		if (outcome[0] > outcome[1]) {
			quokka = false
			message.body(`${response}
      \nhttps://quokkas.amyskapers.tech/img/quokka_(1).jpg`)
		} else {
			message.body(response)
		}
	} else {
		let photo = Math.floor(Math.random() * 12),
			type = 'jpg'

		if (RegExp(/\d+/).test(request) && request.match(/(\d+)/)[0] < 12) {
			photo = request.match(/(\d+)/)[0]
		}

		if (RegExp('quokka', 'i').test(request)) {
			message.body(`This is a quokka`)
			message.media(`https://quokkas.amyskapers.tech/img/quokka_(${photo}).${type}`)
		} else {
			message.body(
				`Welcome to Quokka bot! I can do a bunch of different things that have to do with quokkas.
        \nNeed a picture of a quokka? Just ask me
        \nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`
			)
		}
	}

	res.writeHead(200, { 'Content-Type': 'text/xml' })
	res.end(message.toString())
})

app.get('/email', (req, res) => {
	res.render('sendgrid.html', {
		title: 'Email | Quokkabot',
	})
})

app.listen(process.env.PORT || 3000, () => {
	console.log(`Quokka or Not listening on port ${process.env.PORT || 3000}`)
})
