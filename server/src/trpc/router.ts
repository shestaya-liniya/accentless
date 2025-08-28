import { pronunciationAssessment } from '../api/pronunciationAssessment/controller'
import { sample } from '../api/sample/controller'
import { router } from '.'

export const appRouter = router({
	sample,
	pronunciationAssessment,
})

export type AppRouter = typeof appRouter
