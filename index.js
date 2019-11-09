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
  authToken = process.env.AUTH_TOKEN,
  client = require("twilio")(accountSid, authToken),
  MessagingResponse = require("twilio").twiml.MessagingResponse;

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
  const results = await customVision();

  let outcome = quokkaTest(results);

  if (outcome[0] > outcome[1]) {
    outcome = false;
  } else {
    outcome = true;
  }

  res.render("index.html", {
    title: "Quokka or Not",
    deets: [accountSid, authToken],
    results: results,
    image: testFile,
    outcome: outcome
  });
});

app.get("/twilio", (req, res) => {
  res.write("<h1>Quokka on demand</h1>");

  client.messages
    .create({
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
      from: "+61488845130",
      to: "+61438984242"
    })
    .then(message => console.log(message.sid));
});

app.post("/sms", async (req, res) => {
  const twiml = new MessagingResponse();

  let request = req.body.Body,
    image = req.body.MediaUrl0,
    message = twiml.message();

  let results = await customVision(image),
    outcome = quokkaTest(results),
    quokka = true;

  console.log("test");

  if (outcome[0] > outcome[1]) {
    quokka = false;
    message.body(
      `Sorry, doesn't look like that's a quokka 😢
      \nQuokka: ${(outcome[1] * 100).toFixed(2)}%, Not Quokka: ${(
        outcome[0] * 100
      ).toFixed(2)}%
      \nThat's pretty sad though, so here's a quokka`
    );
    message.media("https://quokkas.amyskapers.tech/img/quokka_(1).jpg");
  } else {
    message.body(
      `Yep, that looks like a quokka!
        \nQuokka: ${(outcome[1] * 100).toFixed(2)}%, Not Quokka: ${(
        outcome[0] * 100
      ).toFixed(2)}%`
    );
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(message.toString());
});

app.post("/facebook", async (req, res) => {
  const twiml = new MessagingResponse();

  let request = req.body.Body,
    image = req.body.MediaUrl0,
    message = twiml.message();

  let results = await customVision(image),
    outcome = quokkaTest(results),
    quokka = true;

  console.log("test");

  if (outcome[0] > outcome[1]) {
    quokka = false;
    message.body(
      `Sorry, doesn't look like that's a quokka 😢
      \nQuokka: ${(outcome[1] * 100).toFixed(2)}%, Not Quokka: ${(
        outcome[0] * 100
      ).toFixed(2)}%
      \nThat's pretty sad though, so here's a quokka
      \nhttps://quokkas.amyskapers.tech/img/quokka_(1).jpg`
    );
  } else {
    message.body(
      `Yep, that looks like a quokka!
        \nQuokka: ${(outcome[1] * 100).toFixed(2)}%, Not Quokka: ${(
        outcome[0] * 100
      ).toFixed(2)}%`
    );
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(message.toString());
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Quokka or Not listening on port 3000");
});
