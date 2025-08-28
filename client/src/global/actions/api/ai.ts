import type { SampleDifficultyType } from '@server/api/sample/type'

import Api from '@/api/index'
import type { GetPronunciationAssessmentPayload } from '@/api/types'
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
		payload: GetPronunciationAssessmentPayload,
	) => {
		setGlobalState('recognition', {
			status: 'processing',
		})

		const res = await Api.getPronunciationAssessment(payload)
		const asmRes = res.NBest[0]
		const generalAsm = asmRes.PronunciationAssessment

		if (res.RecognitionStatus !== 'Success') {
			setGlobalState('recognition', {
				status: 'error',
				errorMessage: res.RecognitionStatus,
			})
			return
		}

		const phonemeToScoreRecord: Record<string, number> = {}
		const ipaWords: string[] = []

		asmRes.Words.forEach(word => {
			let wordIpa = ''

			if (!word.Phonemes) return

			word.Phonemes.forEach(phoneme => {
				phonemeToScoreRecord[phoneme.Phoneme] =
					phoneme.PronunciationAssessment.AccuracyScore
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
				accuracy: generalAsm.AccuracyScore,
				completeness: generalAsm.CompletenessScore || 0,
				fluency: generalAsm.FluencyScore || 0,
				phonemesToScore: phonemeToScoreRecord,
				ipa,
			},
		})
	},
}
