import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { WorkerEntrypoint } from 'cloudflare:workers'

import { ENDPOINTS } from './lib/const'
import { addCORSHeaders, handleCORSPreflight } from './lib/cors'
import { createTRPCContext, Env } from './trpc/context'
import { appRouter } from './trpc/router'

export default class TRPCCloudflareWorkerExample extends WorkerEntrypoint<Env> {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url)

		if (request.method === 'OPTIONS') {
			return handleCORSPreflight(request, this.env)
		}

		if (url.pathname.startsWith(ENDPOINTS.API)) {
			const response = await fetchRequestHandler({
				endpoint: ENDPOINTS.API,
				req: request,
				router: appRouter,
				createContext: ({ req, resHeaders, info }) =>
					createTRPCContext({
						req,
						resHeaders,
						env: this.env,
						info,
					}),
			})

			return addCORSHeaders(request, response, this.env)
		}

		return this.env.ASSETS.fetch(request)
	}
}
