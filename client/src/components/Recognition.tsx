import { createMemo, createSignal, Match, Show, Switch } from 'solid-js'

import SpeakerOutlineIcon from '@/assets/speaker-outline.svg'
import RecognitionActions from '@/components/RecognitionActions'
import RecognitionHeader from '@/components/RecognitionHeader'
import RecognitionIntro from '@/components/RecognitionIntro'
import RecognitionIpa from '@/components/RecognitionIpa'
import Tappable from '@/components/ui/Tappable'
import VoiceVisualizer from '@/components/ui/VoiceVisualizer'
import { getGlobal } from '@/global'
import { getActions } from '@/global/actions'
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder'
import { syntheseBrowserSpeech } from '@/lib/utils/browser-speech'

const Recognition = () => {
	const global = getGlobal()
	const ownState = createMemo(() => global.recognition)
	const sampleState = createMemo(() => ownState().sample)

	const { fetchSamplePhrase, getAccuracyFromRecordedAudio } = getActions()
	const { status, startRecording, stopRecording } = useAudioRecorder()

	const [userAudio, setUserAudio] = createSignal<HTMLAudioElement | undefined>(
		undefined,
	)

	const handleToggleRecording = () => {
		if (status() !== 'recording') {
			const handleStop = (audioUrl: string, audioFile: File) => {
				const samplePhrase = global.recognition.sample?.text
				if (!samplePhrase) return

				const audio = new Audio(audioUrl)
				setUserAudio(audio)

				getAccuracyFromRecordedAudio({
					audioFile,
					referenceText: samplePhrase,
				})
			}

			if (status() === 'inactive') {
				fetchSamplePhrase({
					callback: () => startRecording(handleStop),
				})
			} else {
				startRecording(handleStop)
			}
		} else if (status() === 'recording') {
			stopRecording()
		}
	}

	const handlePlaySample = () => {
		const sampleText = sampleState()?.text

		if (sampleText) {
			syntheseBrowserSpeech(sampleText)
		}
	}

	const handleSkip = () => {
		fetchSamplePhrase()
	}

	const handleNext = () => {
		fetchSamplePhrase()
	}

	return (
		<div class="flex flex-col h-screen relative">
			<div class="flex-1">
				<RecognitionHeader />
			</div>
			<div class="flex-1 grid place-content-center">
				<div class="flex flex-col px-4 items-center justify-center max-w-[800px] animate-fadeIn-blurOut">
					<Switch>
						<Match when={ownState().status === 'inactive'}>
							<RecognitionIntro />
						</Match>
						<Match when={ownState().status === 'loading-sample'}>
							<div>Loading...</div>
						</Match>
						<Match when={ownState().status === 'sample-loaded' && sampleState}>
							<div class="text-2xl select-text">{sampleState()?.text}</div>
							<div class="text-white/50 font-mono mt-2 select-text">
								{sampleState()?.ipa}
							</div>
						</Match>
						<Match when={ownState().status === 'processing'}>
							<div>Processing...</div>
						</Match>
						<Match when={ownState().status === 'success' && ownState().result}>
							<div class="text-2xl select-text">{sampleState()?.text}</div>
							<div class="flex gap-2 items-center mt-2">
								<Tappable
									class="rounded-full p-1"
									onClick={() => userAudio()?.play()}
								>
									<SpeakerOutlineIcon class="h-5 w-5" />
								</Tappable>
								<div class="text-white/50 font-mono select-text flex flex-wrap">
									<RecognitionIpa />
								</div>
							</div>
							<div class="grid grid-cols-3 w-full mt-4">
								<div class="flex flex-col items-center justify-center">
									<div>Accuracy</div>
									<div>{ownState().result?.accuracy}</div>
								</div>
								<div class="flex flex-col items-center justify-center">
									<div>Completeness</div>
									<div>{ownState().result?.completeness}</div>
								</div>
								<div class="flex flex-col items-center justify-center">
									<div>Fluency</div>
									<div>{ownState().result?.fluency}</div>
								</div>
							</div>
						</Match>
					</Switch>
					<Show
						when={
							ownState().status === 'sample-loaded' ||
							ownState().status === 'success'
						}
					>
						<RecognitionActions
							playSample={handlePlaySample}
							skipSample={handleSkip}
							nextSample={handleNext}
							accuracyScore={ownState().result?.accuracy}
						/>
					</Show>
				</div>
			</div>
			<div class="flex-1 flex items-center justify-center py-12">
				<VoiceVisualizer
					isRecording={status() === 'recording'}
					toggleIsRecording={handleToggleRecording}
				/>
			</div>
		</div>
	)
}

export default Recognition
