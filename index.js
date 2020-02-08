require('dotenv').config()

const express = require('express'),
app = express()

app.get('/', (req, res) => {
	res.send('Welcome to Quokkabot')
})

app.listen(process.env.PORT || 3000, () => {
	console.log(`Example app listening on port ${process.env.PORT || 3000}`)
})