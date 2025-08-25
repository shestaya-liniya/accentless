import GithubIcon from '@/assets/github.svg'
import SettingsButton from '@/components/settings/SettingsButton'
import { GUTHUB_LINK } from '@/lib/const'

const RecognitionHeader = () => {
	return (
		<div class="flex flex-col items-center justify-between relative">
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
	)
}

export default RecognitionHeader
