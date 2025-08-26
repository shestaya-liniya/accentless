import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import SampleService from '../api/sample/sample.service'

export interface Env {
	CLIENT_ORIGIN: string
	ASSETS: Fetcher
}

export function createTRPCContext(
	opts: FetchCreateContextFnOptions & { env: Env },
) {
	const services = {
		sampleService: new SampleService(opts.env.ASSETS),
	}
	return {
		req: opts.req,
		resHeaders: opts.resHeaders,
		info: opts.info,
		...services,
	}
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>
