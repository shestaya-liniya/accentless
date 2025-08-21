import { globalState } from '..'
import type { ActionHandler, Actions,ActionsPayload } from './type'

const actionHandlers: { [T in keyof ActionsPayload]?: ActionHandler<T>[] } = {}
const actions = {} as Actions

export function getActions(): Actions {
	return actions
}

export function addActionHandler<T extends keyof ActionsPayload>(
	name: T,
	handler: ActionHandler<T>,
) {
	if (!actionHandlers[name]) {
		actionHandlers[name] = []
		actions[name] = ((payload: ActionsPayload[T]) => {
			actionHandlers[name]?.forEach(h => {
				h(globalState, actions, payload)
			})
		}) as Actions[T]
	}
	actionHandlers[name]!.push(handler)
}
