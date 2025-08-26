import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import type { Env } from '.'
import SampleService from './api/sample/sample.service'

export function createTRPCContext(
	opts: FetchCreateContextFnOptions & { env: Env },
) {
	const sampleService = new SampleService(opts.env.ASSETS)
	return {
		req: opts.req,
		resHeaders: opts.resHeaders,
		info: opts.info,
		sampleService,
		env: opts.env,
	}
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>
