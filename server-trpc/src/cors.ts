import { Env } from '.'

function isOriginAllowed(
	origin: string | null,
	allowedOrigin: string,
): boolean {
	if (!origin) return false
	const allowedOrigins = allowedOrigin.split(',').map(o => o.trim())
	return allowedOrigins.includes(origin)
}

export function addCORSHeaders(
	request: Request,
	response: Response,
	env: Env,
): Response {
	const origin = request.headers.get('Origin')
	const newResponse = new Response(response.body, response)

	if (isOriginAllowed(origin, env.CLIENT_ORIGIN)) {
		newResponse.headers.set('Access-Control-Allow-Origin', origin!)
		newResponse.headers.set(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization',
		)
		newResponse.headers.set('Access-Control-Allow-Credentials', 'true')
		newResponse.headers.set(
			'Access-Control-Allow-Methods',
			'GET, POST, OPTIONS',
		)
		newResponse.headers.set('Access-Control-Max-Age', '86400')
	}

	return newResponse
}

export function handleCORSPreflight(request: Request, env: Env): Response {
	const origin = request.headers.get('Origin')

	if (!isOriginAllowed(origin, env.CLIENT_ORIGIN)) {
		return new Response('CORS policy violation', {
			status: 403,
			statusText: 'Forbidden',
		})
	}

	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': origin!,
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Access-Control-Allow-Credentials': 'true',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Max-Age': '86400',
		},
	})
}
