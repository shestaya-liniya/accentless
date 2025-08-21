import type { SampleDifficultyType } from '@/lib/type'

export type GlobalState = {
	lang: 'en'
	difficulty: SampleDifficultyType
	samplePhrase: {
		isLoading: boolean
		result?: {
			text: string[]
			ipa: string
		}
	}
}
