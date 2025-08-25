import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { WorkerEntrypoint } from 'cloudflare:workers'

import { addCORSHeaders, handleCORSPreflight } from './cors'
import { appRouter } from './router'

export interface Env {
	CLIENT_ORIGIN: string
}

export default class TRPCCloudflareWorkerExample extends WorkerEntrypoint<Env> {
	async fetch(request: Request): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return handleCORSPreflight(request, this.env)
		}

		const response = await fetchRequestHandler({
			endpoint: '/trpc',
			req: request,
			router: appRouter,
			createContext: () => ({ env: this.env }),
		})

		return addCORSHeaders(request, response, this.env)
	}
}
