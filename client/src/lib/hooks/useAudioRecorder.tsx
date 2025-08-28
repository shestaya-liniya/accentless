import { createSignal } from 'solid-js'

import { convertToWAV } from '@/lib/utils/audio-to-wav'

export const useAudioRecorder = () => {
	const [status, setStatus] = createSignal<
		'inactive' | 'recording' | 'stopped'
	>('inactive')

	const [mediaRecorder, setMediaRecorder] = createSignal<MediaRecorder | null>(
		null,
	)

	const mediaStreamConstraints = {
		audio: {
			channelCount: 1,
			sampleRate: 16000, // 16 kHz (Azure requirement https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-speech-to-text-short#audio-formats)
			echoCancellation: true,
			noiseSuppression: true,
			autoGainControl: true,
		},
	}

	const mediaRecorderOptions = {
		audioBitsPerSecond: 256000, // 256 kbps as recommended by Azure
	}

	const startRecording = (
		onStopCallback: (audioUrl: string, audioFile: File) => void,
	) => {
		navigator.mediaDevices
			.getUserMedia(mediaStreamConstraints)
			.then(audioStream => {
				const audioChunks: Blob[] = []
				const mediaRecorder = new MediaRecorder(
					audioStream,
					mediaRecorderOptions,
				)

				mediaRecorder.start()

				setMediaRecorder(mediaRecorder)
				setStatus('recording')

				mediaRecorder.ondataavailable = event => {
					audioChunks.push(event.data)
				}

				mediaRecorder.onstop = async () => {
					const audioBlob = new Blob(audioChunks)
					const audioWav = await convertToWAV(audioBlob)
					const audioUrl = URL.createObjectURL(audioWav)

					const audioFile = new File(
						[audioWav],
						`recording-${Date.now()}.wav`,
						{
							type: 'audio/wav',
							lastModified: Date.now(),
						},
					)

					audioStream.getTracks().forEach(track => track.stop())

					onStopCallback(audioUrl, audioFile)
				}

				mediaRecorder.onerror = event => {
					console.error('MediaRecorder error:', event)
					setStatus('inactive')
					audioStream.getTracks().forEach(track => track.stop())
				}
			})
	}

	const stopRecording = () => {
		if (mediaRecorder()) {
			setStatus('stopped')
			mediaRecorder()!.stop()
		}
	}

	return {
		status,
		startRecording,
		stopRecording,
	}
}
