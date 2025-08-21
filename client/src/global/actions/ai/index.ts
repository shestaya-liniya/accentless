import AiApi from '@/api/ai'
import { setGlobalState } from '@/global'
import { addActionHandler } from '@/global/actions'

addActionHandler('fetchSamplePhrase', async (global, _actions, payload) => {
	setGlobalState('samplePhrase', {
		isLoading: true,
		result: undefined,
	})

	const res = await AiApi.getSample({
		category: global.difficulty,
		language: global.lang,
	})

	payload?.callback()

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

addActionHandler(
	'getAccuracyFromRecordedAudio',
	async (_global, _actions, payload) => {
		const res = await AiApi.getAccuracyFromRecordedAudio(payload)
		console.log(res)
	},
)
