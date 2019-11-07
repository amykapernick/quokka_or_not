require("dotenv").config();

const express = require("express"),
  nunjucks = require("nunjucks"),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  PredictionApi = require("@azure/cognitiveservices-customvision-prediction");

const app = express(),
  key = process.env.API_KEY,
  endpoint = "https://southcentralus.api.cognitive.microsoft.com/",
  publishIterationName = process.env.ITERATION,
  projectId = process.env.PROJECT_ID,
  accountSid = process.env.ACCOUNT_SID,
  authToken = process.env.AUTH_TOKEN;

const predictor = new PredictionApi.PredictionAPIClient(key, endpoint),
  testFile = `quokka_test.jpg`;

const customVision = async image => {
  console.log(image);
  if (image) {
    return (results = await predictor.classifyImageUrl(
      projectId,
      publishIterationName,
      { url: image }
    ));
  } else {
    return (results = await predictor.classifyImage(
      projectId,
      publishIterationName,
      fs.readFileSync(`./img/${testFile}`)
    ));
  }
};

const quokkaTest = res => {
  let outcome = [];

  results.predictions.forEach(tag => {
    if (tag.tagName == "Negative") {
      outcome[0] = tag.probability;
    } else if (tag.tagName == "Quokka") {
      outcome[1] = tag.probability;
    }
  });

  return outcome;
};

nunjucks.configure(["views/"], {
  autoescape: true,
  express: app
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("img"));

app.get("/", async (req, res) => {
  // const results = await customVision();

  // let outcome = quokkaTest(results);

  // if (outcome[0] > outcome[1]) {
  //   outcome = false;
  // } else {
  //   outcome = true;
  // }

  res.render("index.html", {
    title: "Quokka or Not",
    deets: [accountSid, authToken]
    //   // results: results,
    //   // image: testFile,
    //   // outcome: outcome
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Quokka or Not listening on port 3000");
});
