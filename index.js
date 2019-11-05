require("dotenv").config();

const express = require("express"),
  nunjucks = require("nunjucks"),
  util = require("util"),
  fs = require("fs"),
  PredictionApiClient = require("@azure/cognitiveservices-customvision-prediction");

const app = express(),
  setTimeoutPromise = util.promisify(setTimeout),
  predictionKey = process.env.PREDICTION_KEY;

app.use(express.static("/public"));

const env = nunjucks.configure(["views/"], {
  autoescape: true,
  express: app
});

app.get("/", (req, res) => {
  res.render("index.html", { title: "Quokka or Not" });
});

app.listen(3000, () => {
  console.log("Quokka or Not listening on port 3000");
});
