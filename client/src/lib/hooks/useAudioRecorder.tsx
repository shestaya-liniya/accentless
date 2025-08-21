import { blobToBase64 } from '@/lib/utils/formats'
import { createSignal } from 'solid-js'

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
			sampleRate: 48000,
		},
	}

	const startRecording = (
		onStopCallback: (audioUrl: string, audioBase64: string) => void,
	) => {
		navigator.mediaDevices
			.getUserMedia(mediaStreamConstraints)
			.then(audioStream => {
				const audioChunks: Blob[] = []
				const mediaRecorder = new MediaRecorder(audioStream)
				mediaRecorder.start()

				setMediaRecorder(mediaRecorder)
				setStatus('recording')

				mediaRecorder.ondataavailable = event => {
					audioChunks.push(event.data)
				}

				mediaRecorder.onstop = async () => {
					console.log('stopp')
					const audioBlob = new Blob(audioChunks, { type: 'audio/ogg;' })
					const audioUrl = URL.createObjectURL(audioBlob)
					const audioBase64 = await blobToBase64(audioBlob)

					onStopCallback(audioUrl, audioBase64)
				}
			})
	}

	const stopRecording = () => {
		console.log(mediaRecorder(), 'media recorder')
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
