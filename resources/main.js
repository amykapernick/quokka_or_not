detectQuokka = () => {
	const quokka = document.querySelector('#imageUrl').value,
		url = window.location.href

	window.location = `${url}results?${quokka}`
}
