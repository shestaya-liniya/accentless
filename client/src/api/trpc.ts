import type { AppRouter } from '@server/trpc/router'
import {
	createTRPCClient,
	httpBatchLink,
	httpLink,
	isNonJsonSerializable,
	splitLink,
} from '@trpc/client'

const url = import.meta.env.VITE_API_BASE_URL

export const trpc = createTRPCClient<AppRouter>({
	links: [
		splitLink({
			condition: op => isNonJsonSerializable(op.input),
			true: httpLink({
				url,
			}),
			false: httpBatchLink({
				url,
			}),
		}),
	],
})
