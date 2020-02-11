require('dotenv').config()


module.exports = async function (context) {
    const req = context.req,
    fs = require('file-system'),
    multer = require('multer'),
    streams = require('memory-stream')

    context.log('JavaScript HTTP trigger function processed a request.');
    context.log('****************** context start');

    context.log(context);

    var stream = new streams.ReadableStream(req.body); 
    for (const key in req) {
        if (req.hasOwnProperty(key)) {
            stream[key] = req[key];
        }
    }

    context.log(stream)
};

