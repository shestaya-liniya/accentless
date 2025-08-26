import type { AppRouter } from '@server/trpc/router'
import { createTRPCClient, httpBatchLink } from '@trpc/client'

export const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: import.meta.env.VITE_API_BASE_URL,
		}),
	],
})
