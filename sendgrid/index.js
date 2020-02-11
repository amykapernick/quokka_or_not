require('dotenv').config()


module.exports = async function (context) {
    context.log('sendgrid function')

    const req = context.req,
    multipart = require('../parse-multipart/multipart.js'),
    bodyBuffer = Buffer.from(req.body),
    boundary = multipart.getBoundary(req.headers['content-type']),
    body = multipart.Parse(bodyBuffer, boundary)

    context.log('body')
    context.log(body)  
};

