import type { SampleDifficultyType } from '@server/api/sample/sample.type'

import { trpc } from '@/api/trpc'
import type { GetPronunciationAssessmentPayload } from '@/api/types'

class Api {
	async getSample(difficulty: SampleDifficultyType) {
		return trpc.sample.getByDifficulty.query({
			difficulty,
		})
	}

	async getPronunciationAssessment(payload: GetPronunciationAssessmentPayload) {
		const formData = new FormData()
		formData.append('audioFile', payload.audioFile)
		formData.append('referenceText', payload.referenceText)

		return trpc.pronunciationAssessment.performAssessment.mutate(formData)
	}
}

export default new Api()
