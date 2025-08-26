import type { Fetcher } from '@cloudflare/workers-types'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { WorkerEntrypoint } from 'cloudflare:workers'

import { createTRPCContext } from './context'
import { addCORSHeaders, handleCORSPreflight } from './cors'
import { appRouter } from './router'

export interface Env {
	CLIENT_ORIGIN: string
	ASSETS: Fetcher
}

export default class TRPCCloudflareWorker extends WorkerEntrypoint<Env> {
	async fetch(request: Request) {
		const url = new URL(request.url)

		if (url.pathname.startsWith('/trpc/')) {
			if (request.method === 'OPTIONS') {
				return handleCORSPreflight(request, this.env)
			}

			const response = await fetchRequestHandler({
				endpoint: '/trpc',
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

		return this.env.ASSETS.fetch(request.url)
	}
}
