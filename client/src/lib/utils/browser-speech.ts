let cachedVoices: SpeechSynthesisVoice[] | null = null

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
	return new Promise(resolve => {
		const voices = speechSynthesis.getVoices()
		if (voices.length > 0) {
			cachedVoices = voices
			resolve(voices)
		} else {
			speechSynthesis.onvoiceschanged = () => {
				const loadedVoices = speechSynthesis.getVoices()
				cachedVoices = loadedVoices
				resolve(loadedVoices)
			}
		}
	})
}

export async function syntheseBrowserSpeech(text: string) {
	const voices = cachedVoices || (await loadVoices())
	const enVoice = voices.find(v => v.lang.startsWith('en'))

	if (!enVoice) {
		console.error('Error while synthesizing speech: No English voice found')
		return
	}

	const utterance = new SpeechSynthesisUtterance(text)
	utterance.voice = enVoice
	utterance.pitch = 1
	utterance.rate = 1
	utterance.volume = 1

	speechSynthesis.speak(utterance)
}
