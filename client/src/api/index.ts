import type { SampleDifficultyType } from '@server/api/sample/sample.type'
import axios, { type AxiosInstance } from 'axios'

import { trpc } from '@/api/trpc'

import type {
	GetAccuracyFromRecordedAudioBody,
	GetAccuracyFromRecordedAudioResponse,
} from './types'

class Api {
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

	async getSample(difficulty: SampleDifficultyType) {
		return trpc.sample.getByDifficulty.query({
			difficulty,
		})
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

export default new Api()
