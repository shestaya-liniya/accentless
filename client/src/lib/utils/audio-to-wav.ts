interface AudioBufferToWavOptions {
	float32?: boolean
}

export function audioBufferToWav(
	buffer: AudioBuffer,
	opt: AudioBufferToWavOptions = {},
): ArrayBuffer {
	const numChannels = buffer.numberOfChannels
	const sampleRate = buffer.sampleRate
	const format = opt.float32 ? 3 : 1
	const bitDepth = format === 3 ? 32 : 16

	let result: Float32Array
	if (numChannels === 2) {
		result = interleave(buffer.getChannelData(0), buffer.getChannelData(1))
	} else {
		result = buffer.getChannelData(0)
	}

	return encodeWAV(result, format, sampleRate, numChannels, bitDepth)
}

function encodeWAV(
	samples: Float32Array,
	format: number,
	sampleRate: number,
	numChannels: number,
	bitDepth: number,
): ArrayBuffer {
	const bytesPerSample = bitDepth / 8
	const blockAlign = numChannels * bytesPerSample

	const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample)
	const view = new DataView(buffer)

	/* RIFF identifier */
	writeString(view, 0, 'RIFF')
	/* RIFF chunk length */
	view.setUint32(4, 36 + samples.length * bytesPerSample, true)
	/* RIFF type */
	writeString(view, 8, 'WAVE')
	/* format chunk identifier */
	writeString(view, 12, 'fmt ')
	/* format chunk length */
	view.setUint32(16, 16, true)
	/* sample format (raw) */
	view.setUint16(20, format, true)
	/* channel count */
	view.setUint16(22, numChannels, true)
	/* sample rate */
	view.setUint32(24, sampleRate, true)
	/* byte rate (sample rate * block align) */
	view.setUint32(28, sampleRate * blockAlign, true)
	/* block align (channel count * bytes per sample) */
	view.setUint16(32, blockAlign, true)
	/* bits per sample */
	view.setUint16(34, bitDepth, true)
	/* data chunk identifier */
	writeString(view, 36, 'data')
	/* data chunk length */
	view.setUint32(40, samples.length * bytesPerSample, true)

	if (format === 1) {
		// Raw PCM
		floatTo16BitPCM(view, 44, samples)
	} else {
		writeFloat32(view, 44, samples)
	}

	return buffer
}

function interleave(inputL: Float32Array, inputR: Float32Array): Float32Array {
	const length = inputL.length + inputR.length
	const result = new Float32Array(length)

	let index = 0
	let inputIndex = 0

	while (index < length) {
		result[index++] = inputL[inputIndex]
		result[index++] = inputR[inputIndex]
		inputIndex++
	}
	return result
}

function writeFloat32(
	output: DataView,
	offset: number,
	input: Float32Array,
): void {
	for (let i = 0; i < input.length; i++, offset += 4) {
		output.setFloat32(offset, input[i], true)
	}
}

function floatTo16BitPCM(
	output: DataView,
	offset: number,
	input: Float32Array,
): void {
	for (let i = 0; i < input.length; i++, offset += 2) {
		const s = Math.max(-1, Math.min(1, input[i]))
		output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
	}
}

function writeString(view: DataView, offset: number, string: string): void {
	for (let i = 0; i < string.length; i++) {
		view.setUint8(offset + i, string.charCodeAt(i))
	}
}

export function createWavBlob(arrayBuffer: ArrayBuffer): Blob {
	return new Blob([arrayBuffer], { type: 'audio/wav' })
}

export const convertToWAV = async (webmBlob: Blob): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		const audioContext = new (window.AudioContext ||
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(window as any).webkitAudioContext)({
			sampleRate: 16000, // Force 16kHz for Azure compatibility
		})

		const fileReader = new FileReader()
		fileReader.onload = async e => {
			try {
				const arrayBuffer = e.target?.result as ArrayBuffer
				const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

				const wavArrayBuffer = audioBufferToWav(audioBuffer)

				const wavBlob = createWavBlob(wavArrayBuffer)
				resolve(wavBlob)
			} catch (error) {
				console.error('Audio conversion error:', error)
				reject(error)
			}
		}
		fileReader.onerror = reject
		fileReader.readAsArrayBuffer(webmBlob)
	})
}
