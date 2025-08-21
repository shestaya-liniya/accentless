import { createMemo, createSignal, Match, Switch } from 'solid-js'

import GithubIcon from '@/assets/github.svg'
import NextIcon from '@/assets/next.svg'
import VoiceChatIcon from '@/assets/voice-chat.svg'
import SettingsButton from '@/components/settings/SettingsButton'
import Button from '@/components/ui/Button'
import Tappable from '@/components/ui/Tappable'
import VoiceVisualizer from '@/components/ui/VoiceVisualizer'
import { getGlobal } from '@/global'
import { getActions } from '@/global/actions'
import { AUTHORS, GUTHUB_LINK } from '@/lib/const'
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder'
import { syntheseBrowserSpeech } from '@/lib/utils/browser-speech'

const Main = () => {
	const global = getGlobal()
	const ownState = createMemo(() => global.samplePhrase)
	const { fetchSamplePhrase, getAccuracyFromRecordedAudio } = getActions()

	const { status, startRecording, stopRecording } = useAudioRecorder()

	const [hint, setHint] = createSignal('Push to start')

	const handleToggleRecording = () => {
		if (status() !== 'recording') {
			const handleStop = (audioUrl: string, audioBase64: string) => {
				const samplePhrase = global.samplePhrase.result?.text
				if (!samplePhrase) return

				const audio = new Audio(audioUrl)
				audio.play()

				getAccuracyFromRecordedAudio({
					base64Audio: audioBase64,
					language: global.lang,
					title: samplePhrase.join('.'),
				})
			}

			fetchSamplePhrase({
				callback: () => startRecording(handleStop),
			})

			setHint('Push again when done')
		} else if (status() === 'recording') {	
			stopRecording()
			setHint('Push to continue')
		}
	}

	const handlePlaySample = () => {
		const sampleText = ownState().result?.text

		if (sampleText) {
			syntheseBrowserSpeech(sampleText.join('.'))
		}
	}

	const handleSkip = () => {
		fetchSamplePhrase()
	}

	return (
		<div class="flex flex-col h-screen relative">
			<div class="flex-1 flex flex-col items-center justify-between relative">
				<div class="py-4">
					<SettingsButton />
				</div>
				<div
					class="absolute right-2 top-2 cursor-pointer"
					onClick={() => window.open(GUTHUB_LINK)}
				>
					<GithubIcon class="h-10 w-10" />
				</div>
			</div>
			<div class="flex-1 flex flex-col items-center justify-center">
				<Switch>
					<Match when={!ownState().result && !ownState().isLoading}>
						<div class="flex flex-col items-center justify-center">
							<div class="text-2xl">Accentless</div>
							<div class="mt-2">Improve your pronunciation with AI </div>
						</div>
					</Match>
					<Match when={ownState().result}>
						<div class="px-4 flex flex-col items-center justify-center max-w-[800px] animate-fadeIn-blurOut">
							<div class="text-center text-2xl select-text">
								{ownState().result?.text}
							</div>
							<div class="text-center text-white/50 font-mono mt-2">
								{ownState().result?.ipa}
							</div>
							<div class="grid grid-cols-[1fr_auto_1fr] w-80 relative top-8">
								<div class="flex justify-start">
									<Button
										variant="ghost"
										class="text-white/50 text-sm gap-0"
										onClick={() => {}}
									>
										Score 0
									</Button>
								</div>
								<Tappable class="rounded-full p-2" onClick={handlePlaySample}>
									<VoiceChatIcon class="h-6 w-6 relative left-[1px] top-[1px]" />
								</Tappable>
								<div class="flex justify-end">
									<Button
										variant="ghost"
										class="text-white/50 text-sm gap-0"
										onClick={handleSkip}
									>
										Skip
										<NextIcon class="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</Match>
				</Switch>
			</div>
			<div class="flex-1 flex items-center justify-center py-12">
				<VoiceVisualizer
					isRecording={status() === 'recording'}
					toggleIsRecording={handleToggleRecording}
					hint={hint()}
				/>
			</div>
			<div class="absolute bottom-4 right-4 text-xs text-white/50">
				{AUTHORS}
			</div>
		</div>
	)
}

export default Main
