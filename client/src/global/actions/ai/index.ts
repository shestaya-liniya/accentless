import { addActionHandler } from '@/global/actions'
import AiApi from '@/api/ai'
import { setGlobalState } from '@/global'

addActionHandler('fetchSamplePhrase', async global => {
	setGlobalState('samplePhrase', {
		isLoading: true,
		result: undefined,
	})

	const res = await AiApi.getSample({
		category: global.difficulty,
		language: global.lang,
	})

	setGlobalState('samplePhrase', {
		isLoading: false,
		result: {
			text: res.real_transcript,
			ipa: res.ipa_transcript,
		},
	})
})

addActionHandler('setSampleDifficulty', async (_global, _actions, payload) => {
	setGlobalState('difficulty', payload)
})
