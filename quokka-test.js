require('dotenv').config()

const fs = require('fs'),
PredictionApi = require('@azure/cognitiveservices-customvision-prediction'),
key = process.env.API_KEY,
endpoint = process.env.API_KEY,
publishIterationName = process.env.publishIterationName,
predictor = new PredictionApi.PredictionAPIClient(key, endpoint)

const customVision = async (image) => {
	return (results = await predictor.classifyImageUrl(projectId, publishIterationName, { url: image })) 
}

modules.exports = {
	customVision
}