import { createStore } from 'solid-js/store'
import { INITIAL_GLOBAL_STATE } from './initial'
import type { GlobalState } from './type'

export const [globalState, setGlobalState] =
	createStore<GlobalState>(INITIAL_GLOBAL_STATE)

export const getGlobal = () => {
	return globalState
}
