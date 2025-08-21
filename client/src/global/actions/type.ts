import type { SampleDifficultyType } from '@/lib/type'
import type { GlobalState } from '../type'

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
	fetchSamplePhrase: undefined
	setSampleDifficulty: SampleDifficultyType
}
