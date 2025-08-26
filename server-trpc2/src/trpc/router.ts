import { sample } from '../api/sample/sample.controller'
import { router } from '.'

export const appRouter = router({
	sample,
})

export type AppRouter = typeof appRouter
