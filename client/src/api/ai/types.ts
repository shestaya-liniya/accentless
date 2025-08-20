import type { SampleDifficultyType } from '@/lib/const'

export type GetSampleRequestBody = {
	category: SampleDifficultyType
	language: string
}

export type GetSampleResponse = {
	real_transcript: string[]
	ipa_transcript: string
	transcript_translation: string
}
