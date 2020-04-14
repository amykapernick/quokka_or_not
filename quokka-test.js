require('dotenv').config()

const PredictionApi = require('@azure/cognitiveservices-customvision-prediction'),
key = process.env.API_KEY,
endpoint = process.env.ENDPOINT,
projectId = process.env.PROJECT_ID,
iteration = process.env.ITERATION,
predictor = new PredictionApi.PredictionAPIClient(key, endpoint)

const customVision = async (image) => {
	return results = await predictor.classifyImageUrl(projectId, iteration, {url: image})
}

module.exports = {
	customVision
}