import z from 'zod'

import { publicProcedure, router } from '../../trpc'
import { SampleDifficulty } from './type'

export const sample = router({
	getByDifficulty: publicProcedure
		.input(
			z.object({
				difficulty: z.enum(SampleDifficulty),
			}),
		)
		.query(async ({ input, ctx }) => {
			return ctx.sampleService.getSample(input.difficulty)
		}),
})
