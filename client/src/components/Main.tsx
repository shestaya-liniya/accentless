import SettingsButton from '@/components/settings/SettingsButton'
import { createMemo, createSignal, Match, Show, Switch } from 'solid-js'
import VoiceVisualizer from '@/components/ui/VoiceVisualizer'
import { getGlobal } from '@/global'
import { getActions } from '@/global/actions'
import VoiceChatIcon from '@/assets/voice-chat.svg'
import Tappable from '@/components/ui/Tappable'

const Main = () => {
	const global = getGlobal()
	const ownState = createMemo(() => global.samplePhrase)
	const { fetchSamplePhrase } = getActions()

	const [isRecording, setIsRecording] = createSignal(false)

	const handleToggleRecroding = () => {
		if (!isRecording()) {
			fetchSamplePhrase()
		}
		setIsRecording(!isRecording())
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
						<Match when={ownState().isLoading}>
							<div></div>
						</Match>
						<Match when={!ownState().result}>
							<div class="flex flex-col items-center justify-center">
								<div class="text-2xl">Accentless</div>
								<div class="mt-2">Improve your pronunciation with AI </div>
							</div>
						</Match>
						<Match when={ownState().result}>
							<div class="animate-fadeIn-blurOut px-4 flex flex-col items-center justify-center">
								<div class="text-center text-2xl select-text">
									{ownState().result?.text}
								</div>
								<div class="text-center text-white/50 font-mono mt-2">
									{ownState().result?.ipa}
								</div>
								<Tappable class="rounded-full p-2 mt-2" onClick={() => {}}>
									<VoiceChatIcon class="h-6 w-6 relative left-[1px] top-[1px]" />
								</Tappable>
							</div>
						</Match>
					</Switch>
				</div>
				<div class="flex-1 flex items-center justify-center py-12">
					<VoiceVisualizer
						isRecording={isRecording()}
						toggleIsRecording={handleToggleRecroding}
						shouldShowHint={!ownState().result && !ownState().isLoading}
					/>
				</div>
			</div>
		</div>
	)
}

export default Main
