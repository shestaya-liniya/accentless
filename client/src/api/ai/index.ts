import axios, { type AxiosInstance } from 'axios'

import type {
	GetAccuracyFromRecordedAudioBody,
	GetAccuracyFromRecordedAudioResponse,
	GetSampleRequestBody,
	GetSampleResponse,
} from './types'

class AiApi {
	private instance: AxiosInstance

	constructor() {
		this.instance = axios.create({
			baseURL: import.meta.env.VITE_AI_SERVER_BASE_URL,
		})
		this.instance.interceptors.response.use(
			response => response.data,
			error => Promise.reject(error),
		)
	}

	async getSample(body: GetSampleRequestBody): Promise<GetSampleResponse> {
		return this.instance.post('getSample', body)
	}

	async getAccuracyFromRecordedAudio(
		body: GetAccuracyFromRecordedAudioBody,
	): Promise<GetAccuracyFromRecordedAudioResponse> {
		return this.instance.post('GetAccuracyFromRecordedAudio', body)
	}
}

export default new AiApi()
