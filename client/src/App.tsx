import { onMount, Show } from 'solid-js'
import { getActions } from '@/global/actions'
import { getGlobal } from '@/global'

const App = () => {
	const global = getGlobal()
	const { fetchSamplePhrase } = getActions()

	onMount(() => {
		fetchSamplePhrase()
	})

	return (
		<div>
			<Show when={global.samplePhrase.result} fallback={<p>Loading...</p>}>
				{result => (
					<div>
						<div>{result().text}</div>
						<div>{result().ipa}</div>
					</div>
				)}
			</Show>
		</div>
	)
}

export default App
