import { SampleDifficulty } from '@/lib/const'

import type { GlobalState } from './type'

export const INITIAL_GLOBAL_STATE: GlobalState = {
	lang: 'en',
	difficulty: SampleDifficulty.EASY,
	samplePhrase: {
		isLoading: false,
	},
}
