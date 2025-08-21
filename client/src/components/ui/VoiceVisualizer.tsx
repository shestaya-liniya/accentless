import ShinyText from '@/components/ui/ShinyText'
import { createSignal, onCleanup, onMount, Show } from 'solid-js'

interface AudioPermissionResult {
	granted: boolean
	stream?: MediaStream
	error?: Error
}

type OwnProps = {
	isRecording: boolean
	toggleIsRecording: () => void
	hint?: string
}

const VoiceVisualizer = (props: OwnProps) => {
	const [scale, setScale] = createSignal<number>(1)
	const [hasAudioAccess, setHasAudioAccess] = createSignal<boolean>(false)
	const [opacity, setOpacity] = createSignal<number>(0.7)

	let audioContext: AudioContext | null = null
	let analyser: AnalyserNode | null = null
	let frequencyArray: Uint8Array | null = null
	let animationId: number | null = null
	let stream: MediaStream | null = null

	const getBlobPaths = (): string[] => {
		return [
			'M34.2,-51.6C46.3,-52.2,59.6,-47.1,65.9,-37.6C72.2,-28.1,71.5,-14,66.1,-3.2C60.6,7.7,50.4,15.5,44.1,25.1C37.9,34.7,35.6,46.2,28.9,50.7C22.2,55.1,11.1,52.4,-2.2,56.3C-15.6,60.1,-31.1,70.5,-45.2,70.3C-59.4,70.2,-72.1,59.6,-79.9,46.1C-87.7,32.7,-90.5,16.3,-87.3,1.8C-84.1,-12.6,-74.9,-25.3,-66.2,-37.1C-57.4,-48.9,-49.2,-59.9,-38.2,-60C-27.3,-60,-13.6,-49.2,-1.3,-46.9C11,-44.6,22,-50.9,34.2,-51.6Z',
			'M42.5,-63.3C56.8,-65.4,71.1,-57.4,72.2,-45.1C73.2,-32.9,60.9,-16.5,52.3,-5C43.6,6.5,38.6,12.9,34.1,19.1C29.5,25.3,25.5,31.2,19.9,37.5C14.3,43.9,7.1,50.7,-4.7,58.8C-16.5,66.9,-32.9,76.2,-40.5,71C-48.1,65.8,-46.8,46,-51.9,31.8C-57,17.5,-68.5,8.8,-74.4,-3.4C-80.3,-15.5,-80.5,-31.1,-70.7,-37.3C-61,-43.5,-41.2,-40.3,-27.8,-38.7C-14.3,-37.1,-7.2,-37,3.5,-43.1C14.1,-49.1,28.3,-61.3,42.5,-63.3Z',
			'M45.3,-77.1C58.4,-71,68.6,-58.2,74.3,-44.2C80,-30.3,81.3,-15.1,78.6,-1.5C76,12.1,69.3,24.1,62.5,36.3C55.8,48.4,48.9,60.6,38.5,65.6C28,70.5,14,68.1,1.9,64.8C-10.2,61.5,-20.4,57.3,-34,54.1C-47.5,51,-64.3,48.9,-73,40.1C-81.7,31.2,-82.1,15.6,-77.5,2.7C-72.9,-10.3,-63.2,-20.6,-53.1,-26.9C-42.9,-33.1,-32.3,-35.3,-23.4,-43.9C-14.4,-52.4,-7.2,-67.3,4.4,-75C16.1,-82.7,32.2,-83.2,45.3,-77.1Z',
			'M42.9,-74.3C53.7,-68.1,59.1,-52.7,56.8,-38.8C54.5,-24.8,44.5,-12.4,38,-3.7C31.5,4.9,28.6,9.9,27.1,17.2C25.6,24.6,25.6,34.4,21.3,42.7C17,51,8.5,57.8,-0.2,58.2C-9,58.6,-18,52.7,-22.3,44.4C-26.5,36.1,-26,25.4,-30.6,17.6C-35.1,9.8,-44.7,4.9,-52,-4.2C-59.2,-13.3,-64.2,-26.6,-60.1,-35.2C-56,-43.9,-43,-47.9,-31.5,-53.6C-20,-59.4,-10,-66.9,3,-72.2C16.1,-77.5,32.2,-80.5,42.9,-74.3Z',
			'M34.2,-51.6C46.3,-52.2,59.6,-47.1,65.9,-37.6C72.2,-28.1,71.5,-14,66.1,-3.2C60.6,7.7,50.4,15.5,44.1,25.1C37.9,34.7,35.6,46.2,28.9,50.7C22.2,55.1,11.1,52.4,-2.2,56.3C-15.6,60.1,-31.1,70.5,-45.2,70.3C-59.4,70.2,-72.1,59.6,-79.9,46.1C-87.7,32.7,-90.5,16.3,-87.3,1.8C-84.1,-12.6,-74.9,-25.3,-66.2,-37.1C-57.4,-48.9,-49.2,-59.9,-38.2,-60C-27.3,-60,-13.6,-49.2,-1.3,-46.9C11,-44.6,22,-50.9,34.2,-51.6Z',
		]
	}

	// Type guard for AudioContext support
	const isAudioContextSupported = (): boolean => {
		return !!(window.AudioContext || (window as any).webkitAudioContext)
	}

	// Initialize audio context with proper error handling
	const initializeAudio = async (): Promise<AudioPermissionResult> => {
		try {
			if (!navigator.mediaDevices?.getUserMedia) {
				throw new Error('getUserMedia not supported')
			}

			if (!isAudioContextSupported()) {
				throw new Error('AudioContext not supported')
			}

			stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
				},
			})

			await setupAudioAnalysis(stream)
			setHasAudioAccess(true)
			return { granted: true, stream }
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown audio error'
			console.warn('Microphone access denied or not available:', errorMessage)
			setHasAudioAccess(false)
			return { granted: false, error: error as Error }
		}
	}

	const setupAudioAnalysis = async (
		mediaStream: MediaStream,
	): Promise<void> => {
		try {
			const AudioContextClass =
				window.AudioContext || (window as any).webkitAudioContext
			if (!AudioContextClass) {
				throw new Error('AudioContext not available')
			}

			audioContext = new AudioContextClass()

			if (audioContext.state === 'suspended') {
				await audioContext.resume()
			}

			const audioStreamSource: MediaStreamAudioSourceNode =
				audioContext.createMediaStreamSource(mediaStream)
			analyser = audioContext.createAnalyser()

			analyser.fftSize = 1024
			analyser.smoothingTimeConstant = 0.8
			analyser.minDecibels = -90
			analyser.maxDecibels = -10

			audioStreamSource.connect(analyser)
			frequencyArray = new Uint8Array(analyser.frequencyBinCount)
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown setup error'
			console.error('Error setting up audio analysis:', errorMessage)
			setHasAudioAccess(false)
			throw error
		}
	}

	const getCircleScale = (): number => {
		if (hasAudioAccess() && analyser && frequencyArray) {
			try {
				analyser.getByteFrequencyData(frequencyArray)

				let freqSum: number = 0
				const sampleSize: number = Math.min(255, frequencyArray.length)

				for (let i = 0; i < sampleSize; i++) {
					freqSum += frequencyArray[i]
				}

				const freqAvg: number = freqSum / sampleSize
				const normalizedScale: number = freqAvg / 255

				return Math.max(1, Math.min(3, 1 + normalizedScale * 1.2))
			} catch (error: unknown) {
				console.warn('Error getting frequency data:', error)
				return 1
			}
		} else {
			const time: number = Date.now() * 0.005
			return 1 + Math.sin(time) * 0.3
		}
	}

	const animate = (): void => {
		if (props.isRecording) {
			const newScale: number = getCircleScale()
			setScale(newScale)
		} else {
			const currentScale: number = scale()
			if (currentScale > 1) {
				const newScale: number = Math.max(1, currentScale - 0.05)
				setScale(newScale)
			}
		}

		animationId = requestAnimationFrame(animate)
	}

	const startAnimation = async (): Promise<void> => {
		if (!props.isRecording) {
			setOpacity(1)

			if (audioContext && audioContext.state === 'suspended') {
				try {
					await audioContext.resume()
				} catch (error: unknown) {
					console.warn('Could not resume audio context:', error)
				}
			}
		}
	}

	const stopAnimation = (): void => {
		setOpacity(0.7)
	}

	const toggleAnimation = async (): Promise<void> => {
		if (props.isRecording) {
			stopAnimation()
		} else {
			await startAnimation()
			animate()
		}
	}

	const handleClick = (event: MouseEvent): void => {
		event.preventDefault()
		toggleAnimation().catch(console.error)
		props.toggleIsRecording()
	}

	const cleanup = (): void => {
		if (animationId !== null) {
			cancelAnimationFrame(animationId)
			animationId = null
		}

		if (stream) {
			stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
			stream = null
		}

		if (audioContext) {
			audioContext.close().catch(console.error)
			audioContext = null
		}

		analyser = null
		frequencyArray = null
	}

	onMount(async (): Promise<void> => {
		await initializeAudio()
	})

	onCleanup((): void => {
		cleanup()
	})

	const blobContainerStyle = () => ({
		position: 'relative' as const,
		cursor: 'pointer' as const,
		opacity: opacity(),
		transform: `scale(${scale()})`,
		transformOrigin: 'center',
		transition: 'transform 100ms ease-out, opacity 300ms ease',
	})

	const svgWrapperStyle = () => ({
		width: '200px',
		height: '200px',
		position: 'relative' as const,
	})

	const blobSvgStyle = () => ({
		width: '100%',
		height: '100%',
		filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.4))',
	})

	return (
		<div
			style={{
				display: 'flex',
				position: 'relative',
				'flex-direction': 'column',
				'align-items': 'center',
				'justify-content': 'center',
			}}
		>
			<div style={blobContainerStyle()} onClick={handleClick}>
				<div style={svgWrapperStyle()}>
					<svg
						style={blobSvgStyle()}
						viewBox="0 0 200 200"
						xmlns="http://www.w3.org/2000/svg"
						width="100%"
						height="100%"
					>
						<defs>
							<linearGradient
								id="blobGradient"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="100%"
							>
								<stop offset="0%" stop-color="#ff6b6b">
									<animate
										attributeName="stop-color"
										values="#ff6b6b;#4ecdc4;#45b7d1;#96ceb4;#feca57;#ff6b6b"
										dur="4s"
										repeatCount="indefinite"
									/>
								</stop>
								<stop offset="50%" stop-color="#4ecdc4">
									<animate
										attributeName="stop-color"
										values="#4ecdc4;#45b7d1;#96ceb4;#feca57;#ff6b6b;#4ecdc4"
										dur="3s"
										repeatCount="indefinite"
									/>
								</stop>
								<stop offset="100%" stop-color="#45b7d1">
									<animate
										attributeName="stop-color"
										values="#45b7d1;#96ceb4;#feca57;#ff6b6b;#4ecdc4;#45b7d1"
										dur="5s"
										repeatCount="indefinite"
									/>
								</stop>
							</linearGradient>
						</defs>
						<path
							fill="url(#blobGradient)"
							transform="translate(100 100)"
							d={
								props.isRecording
									? undefined
									: 'M0,-50C13.8,-50,27.6,-43.3,38,-33.3C48.3,-23.3,55.2,-10,55.2,3.3C55.2,16.7,48.3,30,38,40C27.6,50,13.8,50,0,50C-13.8,50,-27.6,50,-38,40C-48.3,30,-55.2,16.7,-55.2,3.3C-55.2,-10,-48.3,-23.3,-38,-33.3C-27.6,-43.3,-13.8,-50,0,-50Z'
							}
						>
							{props.isRecording && (
								<animate
									attributeName="d"
									dur="8000ms"
									repeatCount="indefinite"
									values={getBlobPaths().join(';')}
								/>
							)}
						</path>
					</svg>
				</div>
			</div>
			<Show when={props.hint}>
				{hint => (
					<div class="absolute -bottom-8 left-1/2 -translate-x-1/2">
						<ShinyText text={hint()} />
					</div>
				)}
			</Show>
		</div>
	)
}

export default VoiceVisualizer
