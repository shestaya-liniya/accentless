import z from 'zod'

import { publicProcedure, router } from '../../trpc'

export const sample = router({
	getByDifficulty: publicProcedure
		.input(
			z.object({
				difficulty: z.enum(['1', '2', '3']),
			}),
		)
		.query(async ({ input, ctx }) => {
			return ctx.sampleService.getSample(Number(input.difficulty))
		}),
})
