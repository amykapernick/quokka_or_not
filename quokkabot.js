const message = (text) => {
	let results = {},
	photo = Math.floor(Math.random() * 12)

	if(RegExp('quokka', 'i').test(text)) {
		results.body = `This is a quokka`
		
	}
	else {
		results.body = `Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.
		\nNeed a picture of a quokka? Just ask me
		\nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`
	}

	results.media = `https://quokkas.amyskapers.dev/img/quokka_(${photo}).jpg`

	return results
}

const email = (text) => {
	let response,
	photo = Math.floor(Math.random() * 12)

	if(RegExp('quokka', 'i').test(text)) {
		response = `<p>This is a quokka</p>
		<p><img src="https://quokkas.amyskapers.dev/img/quokka_(${photo}).jpg" /></p>`
	}
	else {
		response = `
			<p>Welcome to Quokkabot!</p>
			<p>I can do a bunch of different things that have to do with quokkas.</p>
			<p>Need a picture of a quokka? Just ask me</p>
			<p>Not sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it</p>
			<p><img src="https://quokkas.amyskapers.dev/img/quokka_(${photo}).jpg" /></p>
		`
	}

	return response
}

module.exports = {
	message,
	email
}