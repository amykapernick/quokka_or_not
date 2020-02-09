require('dotenv').config()

const fs = require('fs'),
PredictionApi = require('@azure/cognitiveservices-customvision-prediction'),
key = process.env.API_KEY,
endpoint = process.env.ENDPOINT,
projectId = process.env.PROJECT_ID,
publishIterationName = process.env.ITERATION,
predictor = new PredictionApi.PredictionAPIClient(key, endpoint)

const customVision = async (image) => {
	const results = await predictor.classifyImageUrl(projectId, publishIterationName, { url: image }),
	outcome = quokkaTest(results)

	return outcome
}

const quokkaTest = (results) => {
	let outcome = []

	results.predictions.forEach(tag => {
		const index = tag.TagName == 'Quokka' ? 1 : 0

		outcome[index] = `${(tag.probability * 100).toFixed(2)}%`
	})

	return outcome
}

module.exports = {
	customVision
}