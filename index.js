require("dotenv").config();

const express = require("express"),
  nunjucks = require("nunjucks"),
  util = require("util"),
  fs = require("fs"),
  TrainingApi = require("@azure/cognitiveservices-customvision-training"),
  PredictionApi = require("@azure/cognitiveservices-customvision-prediction");

const app = express(),
  key = process.env.API_KEY,
  endpoint = "https://southcentralus.api.cognitive.microsoft.com/",
  publishIterationName = process.env.ITERATION,
  projectId = process.env.PROJECT_ID;

const predictor = new PredictionApi.PredictionAPIClient(key, endpoint),
  testFile = `quokka_(0).jpg`;

const customVision = async () => {
  return (results = await predictor.classifyImage(
    projectId,
    publishIterationName,
    fs.readFileSync(`./img/${testFile}`)
  ));
};

app.use(express.static("img"));

const env = nunjucks.configure(["views/"], {
  autoescape: true,
  express: app
});

app.get("/", async (req, res) => {
  const results = await customVision();

  let outcome = [];

  results.predictions.forEach(tag => {
    if (tag.tagName == "Negative") {
      outcome[0] = tag.probability;
    } else if (tag.tagName == "Quokka") {
      outcome[1] = tag.probability;
    }
  });

  if (outcome[0] > outcome[1]) {
    outcome = false;
  } else {
    outcome = true;
  }

  console.log(results.predictions);
  res.render("index.html", {
    title: "Quokka or Not",
    results: results,
    image: testFile,
    outcome: outcome
  });
});

app.listen(3000, () => {
  console.log("Quokka or Not listening on port 3000");
});
