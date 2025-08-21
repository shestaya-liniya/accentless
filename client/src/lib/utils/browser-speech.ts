export const syntheseBrowserSpeech = (text: string) => {
	const utterance = new SpeechSynthesisUtterance(text)

	if (!utterance) {
		console.error('Error while sythesing browser speech')
		return
	}

	const voices = speechSynthesis.getVoices()
	const enVoice = voices.find(v => v.lang === 'en-US')

	if (!enVoice) {
		console.error(
			'Error while sythesing browser speech: No english voice found',
		)
		return
	}

	utterance.voice = enVoice

	utterance.pitch = 1
	utterance.rate = 1
	utterance.volume = 1

	speechSynthesis.speak(utterance)
}
