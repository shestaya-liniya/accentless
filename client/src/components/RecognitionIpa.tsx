import { getGlobal } from '@/global'

const RecognitionIpa = () => {
	const global = getGlobal()

	const speechResult = global.recognition.result
	if (!speechResult) return

	const lowColor = '#ef4444' // red-500
	const mediumColor = '#4ade80' // green-400
	const highColor = '#22c55e' // green-500
	const perfectColor = '#16a34a' // green-600

	const getColor = (score: number) => {
		if (score >= 95) return perfectColor
		if (score >= 80) return highColor
		if (score >= 60) return mediumColor
		return lowColor
	}

	const phonemesToScore = speechResult.phonemesToScore || {}

	return speechResult.ipa.split('').map(symbol => {
		if (symbol === ' ') {
			return <span>{'\u00A0'}</span> // non-breaking space
		}

		const score = phonemesToScore[symbol]

		if (score === undefined) {
			return <span class="text-gray-400">{symbol}</span>
		}

		const color = getColor(score)
		return (
			<span style={{ color }} title={`Accuracy: ${score}%`}>
				{symbol}
			</span>
		)
	})
}

export default RecognitionIpa
