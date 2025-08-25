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
		return this.instance.post('sample/get', body)
	}

	async getAccuracyFromRecordedAudio(
		body: GetAccuracyFromRecordedAudioBody,
	): Promise<GetAccuracyFromRecordedAudioResponse> {
		const formData = new FormData()
		formData.append('audio_data', body.audio_data)
		formData.append('sample_text', body.sample_text)

		return this.instance.post('azure/analyzeSpeech', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}
}

export default new AiApi()
