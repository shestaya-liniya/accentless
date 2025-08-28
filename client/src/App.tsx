import { Toaster } from 'solid-toast'

import Recognition from '@/components/Recognition'

const App = () => {
	return (
		<div>
			<div class="app">
				<Recognition />
			</div>
			<Toaster />
		</div>
	)
}

export default App
