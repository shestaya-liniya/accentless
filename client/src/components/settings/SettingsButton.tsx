import Button from '@/components/ui/Button'
import SettingsIcon from '@/assets/settings-outline.svg'
import BarsIcon from '@/assets/poll.svg'
import Modal, { type ModalAction } from '@/components/ui/Modal'
import type { XY } from '@/lib/const'
import LanguageIcon from '@/assets/language.svg'

import { createSignal } from 'solid-js'

const SettingsButton = () => {
	const [isModalOpen, setIsModalOpen] = createSignal(false)
	const [modalPosition, setModalPosition] = createSignal<XY | undefined>(
		undefined,
	)
	const [isIconRotated, setIsIconRotated] = createSignal(false)

	let buttonRef: HTMLDivElement | undefined

	const modalActions: ModalAction[] = [
		{
			title: 'difficulty',
			Icon: BarsIcon,
		},
		{
			title: 'language',
			Icon: LanguageIcon,
		},
	]

	const handleClick = () => {
		if (!buttonRef) return

		setIsModalOpen(true)
		setIsIconRotated(true)

		const rect = buttonRef.getBoundingClientRect()

		setModalPosition({
			x: rect.left + rect.width / 2,
			y: rect.bottom + 8,
		})
	}

	return (
		<>
			<div ref={buttonRef}>
				<Button onClick={handleClick}>
					<SettingsIcon
						class="h-5 w-5 transition-transform duration-300 ease-in-out"
						classList={{
							'rotate-180': isIconRotated(),
						}}
					/>
					<div>Settings</div>
				</Button>
			</div>

			<Modal
				isOpen={isModalOpen()}
				onClose={() => setIsModalOpen(false)}
				onBeforeClose={() => setIsIconRotated(false)}
				actions={modalActions}
				position={modalPosition()}
				centered
			/>
		</>
	)
}

export default SettingsButton
