import type { NoneToVoid, SampleDifficultyType } from '@/lib/type'
import type { GlobalState } from '../type'
import type { GetAccuracyFromRecordedAudioBody } from '@/api/ai/types'

export type ActionHandler<T extends keyof ActionsPayload> = (
	global: GlobalState,
	actions: Actions,
	payload: ActionsPayload[T],
) => GlobalState | void | Promise<void>

export type Actions = {
	[T in keyof ActionsPayload]: undefined extends ActionsPayload[T]
		? (payload?: ActionsPayload[T]) => void
		: (payload: ActionsPayload[T]) => void
}

export interface ActionsPayload {
	fetchSamplePhrase:
		| {
				callback: NoneToVoid
		  }
		| undefined
	setSampleDifficulty: SampleDifficultyType
	getAccuracyFromRecordedAudio: GetAccuracyFromRecordedAudioBody
}
