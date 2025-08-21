import SettingsButton from '@/components/settings/SettingsButton'
import { createMemo, createSignal, Match, Switch } from 'solid-js'
import VoiceVisualizer from '@/components/ui/VoiceVisualizer'
import { getGlobal } from '@/global'
import { getActions } from '@/global/actions'
import VoiceChatIcon from '@/assets/voice-chat.svg'
import Tappable from '@/components/ui/Tappable'
import Button from '@/components/ui/Button'
import NextIcon from '@/assets/next.svg'

const Main = () => {
	const global = getGlobal()
	const ownState = createMemo(() => global.samplePhrase)
	const { fetchSamplePhrase } = getActions()

	const [hint, setHint] = createSignal('Push to start')
	const [isRecording, setIsRecording] = createSignal(false)

	const handleToggleRecording = () => {
		if (!isRecording()) {
			fetchSamplePhrase()
			setHint('Push again when done')
		} else {
			setHint('Push to continue')
		}
		setIsRecording(!isRecording())
	}

	const handleSkip = () => {
		fetchSamplePhrase()
	}

	return (
		<div>
			<div class="flex flex-col h-screen">
				<div class="flex-1 flex flex-col items-center justify-between">
					<div class="py-4">
						<SettingsButton />
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
							<div class="px-4 flex flex-col items-center justify-center animate-fadeIn-blurOut">
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
									<Tappable class="rounded-full p-2" onClick={() => {}}>
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
						isRecording={isRecording()}
						toggleIsRecording={handleToggleRecording}
						hint={hint()}
					/>
				</div>
			</div>
		</div>
	)
}

export default Main
