const quokkaBot = (text) => {
	let results = {},
	photo = Math.floor(Math.random() * 12)

	if(RegExp('quokka', 'i').test(text)) {
		results.body = `This is a quokka`
		
	}
	else {
		results.body = `Welcome to Quokka bot! I can do a bunch of different things that have to do with quokkas.
		\nNeed a picture of a quokka? Just ask me
		\nNot sure if you've seen a quokka? Send me a picture and I'll tell you if there's a quokka in it`
	}

	results.media = `https://quokkas.amyskapers.dev/img/quokka_(${photo}).jpg`
}

module.exports = {
	quokkaBot
}