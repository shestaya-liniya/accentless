import type { RecognitionStatus, SampleDifficultyType } from '@/lib/type'

export type GlobalState = {
	lang: 'en'
	difficulty: SampleDifficultyType

	recognition: {
		status: RecognitionStatus
		sample?: {
			text: string[]
			ipa: string
		}
		result?: {
			accuracy: number
			confidence: number
			fluency: number
			ipa: string
			phonemesToScore: Record<string, number>
		}
		errorMessage?: string
	}
}
