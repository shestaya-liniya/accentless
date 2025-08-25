import { Show } from 'solid-js'

import NextIcon from '@/assets/next.svg'
import VoiceChatIcon from '@/assets/voice-chat.svg'
import Button from '@/components/ui/Button'
import Tappable from '@/components/ui/Tappable'
import type { NoneToVoid } from '@/lib/type'

type OwnProps = {
	playSample: NoneToVoid
	skipSample: NoneToVoid
	nextSample: NoneToVoid
	accuracyScore: number | undefined
}

const RecognitionActions = (props: OwnProps) => {
	return (
		<div class="grid grid-cols-[1fr_auto_1fr] w-80 mt-8">
			<div class="flex justify-start"></div>
			<Tappable class="rounded-full p-2" onClick={props.playSample}>
				<VoiceChatIcon class="h-6 w-6 relative left-[1px] top-[1px]" />
			</Tappable>
			<div class="flex justify-end">
				<Show
					when={props.accuracyScore && props.accuracyScore > 75}
					fallback={
						<Button
							variant="ghost"
							class="text-white/50 text-sm gap-0"
							onClick={props.skipSample}
						>
							Skip
							<NextIcon class="h-4 w-4" />
						</Button>
					}
				>
					<Button class="text-sm" onClick={props.nextSample}>
						Next
						<NextIcon class="h-4 w-4" />
					</Button>
				</Show>
			</div>
		</div>
	)
}

export default RecognitionActions
