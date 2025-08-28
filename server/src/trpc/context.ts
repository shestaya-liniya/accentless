import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import PronunciationAssessment from '../api/pronunciationAssessment/service'
import SampleService from '../api/sample/service'

export interface Env {
	CLIENT_ORIGIN: string
	ASSETS: Fetcher
	AZURE_SUBSCRIPTION_KEY: string
	AZURE_REGION: string
}

export function createTRPCContext(
	opts: FetchCreateContextFnOptions & { env: Env },
) {
	const services = {
		sampleService: new SampleService(opts.env.ASSETS),
		pronunciationAssessmentService: new PronunciationAssessment(
			opts.env.AZURE_SUBSCRIPTION_KEY,
			opts.env.AZURE_REGION,
		),
	}

	return {
		req: opts.req,
		resHeaders: opts.resHeaders,
		info: opts.info,
		...services,
	}
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>
