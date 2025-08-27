import type { SampleDifficultyType } from '@server/api/sample/sample.type'

import Api from '@/api/index'
import type { GetAccuracyFromRecordedAudioBody } from '@/api/types'
import { global, setGlobalState } from '@/global'
import type { NoneToVoid } from '@/lib/type'

export const aiActions = {
	fetchSamplePhrase: async (payload?: { callback: NoneToVoid }) => {
		setGlobalState('recognition', {
			status: 'loading-sample',
			sample: undefined,
			result: undefined,
		})

		const res = await Api.getSample(global.difficulty)

		payload?.callback()

		setGlobalState('recognition', {
			status: 'sample-loaded',
			sample: {
				text: res.text,
				ipa: res.ipa,
			},
		})
	},

	setSampleDifficulty: (payload: SampleDifficultyType) => {
		setGlobalState('difficulty', payload)
	},

	getAccuracyFromRecordedAudio: async (
		payload: GetAccuracyFromRecordedAudioBody,
	) => {
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
}
