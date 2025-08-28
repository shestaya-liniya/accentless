import z from 'zod'

import { publicProcedure, router } from '../../trpc'

export const pronunciationAssessment = router({
	performAssessment: publicProcedure
		.input(
			z
				.instanceof(FormData)
				.transform(fd => Object.fromEntries(fd.entries()))
				.pipe(
					z.object({
						referenceText: z.string(),
						audioFile: z.instanceof(File).refine(f => f.size > 0),
					}),
				),
		)
		.mutation(async ({ input, ctx }) => {
			return ctx.pronunciationAssessmentService.performAssessment({
				referenceText: input.referenceText,
				audioFile: input.audioFile,
			})
		}),
})
