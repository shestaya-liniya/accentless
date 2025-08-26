import Api from '@/api'
import { setGlobalState } from '@/global'
import { addActionHandler } from '@/global/actions'

addActionHandler('fetchSamplePhrase', async (global, _actions, payload) => {
	setGlobalState('recognition', {
		status: 'loading-sample',
		sample: undefined,
		result: undefined,
	})

	const res = await Api.getSample({
		category: global.difficulty,
		language: global.lang,
	})

	payload?.callback()

	setGlobalState('recognition', {
		status: 'sample-loaded',
		sample: {
			text: res.real_transcript,
			ipa: res.ipa_transcript,
		},
	})
})

addActionHandler('setSampleDifficulty', async (_global, _actions, payload) => {
	setGlobalState('difficulty', payload)
})

addActionHandler(
	'getAccuracyFromRecordedAudio',
	async (_global, _actions, payload) => {
		setGlobalState('recognition', {
			status: 'processing',
		})

		const res = await Api.getAccuracyFromRecordedAudio(payload)

		if (res.RecognitionStatus !== 'Success') {
			setGlobalState('recognition', {
				status: 'error',
				errorMessage: res.RecognitionStatus,
			})
			return
		}

		const recognitionRes = res.NBest[0]

		const phonemeToScoreRecord: Record<string, number> = {}

		const ipaWords: string[] = []

		recognitionRes.Words.forEach(word => {
			let wordIpa = ''

			word.Phonemes.forEach(phoneme => {
				phonemeToScoreRecord[phoneme.Phoneme] = phoneme.AccuracyScore
				wordIpa += phoneme.Phoneme
			})

			if (wordIpa) {
				ipaWords.push(wordIpa)
			}
		})

		const ipa = ipaWords.join(' ')

		setGlobalState('recognition', {
			status: 'success',
			result: {
				accuracy: recognitionRes.AccuracyScore,
				confidence: recognitionRes.Confidence,
				fluency: recognitionRes.FluencyScore,
				phonemesToScore: phonemeToScoreRecord,
				ipa,
			},
		})
	},
)
