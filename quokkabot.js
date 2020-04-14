const message = (text) => {
	let results = {},
	photo = Math.floor(Math.random() * 12)

	if(RegExp(/error|issue|wrong/, 'i').test(text)) {
		results.body = `Thanks for reporting your issue, here's a picture of a quokka`
		results.error = true
	}
	else if(RegExp('quokka', 'i').test(text)) {
		results.body = 'This is a quokka'
	}
	else {
		results.body = `Welcome to Quokkabot! I can do a bunch of different things that have to do with quokkas.
		\nNeed a picture of a quokka? Just ask me
		\nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`
	}

	results.media = `https://quokkas.amyskapers.dev/img/quokka_(${photo}).jpg` 

	return results
}

module.exports = {
	message
}