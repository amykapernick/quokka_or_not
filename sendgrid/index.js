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
    context.stream = stream;

    context.log('****************** start');
    const next = (err) => {
        fs.writeFileSync(path.join(__dirname, "../test.png"), context.stream.files[0].buffer);
        context.log('****************** end');

        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.name)
        };

        context.done();
    };
};

