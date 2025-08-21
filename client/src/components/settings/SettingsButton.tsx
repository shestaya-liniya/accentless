import Button from '@/components/ui/Button'
import SettingsIcon from '@/assets/settings-outline.svg'
import BarsIcon from '@/assets/poll.svg'
import Modal, { type ModalAction } from '@/components/ui/Modal'

import LanguageIcon from '@/assets/language.svg'

import { createEffect, createMemo, createSignal, on, onMount } from 'solid-js'
import type { SampleDifficultyType, XY } from '@/lib/type'
import { getGlobal } from '@/global'
import { getActions } from '@/global/actions'
import { SampleDifficulty } from '@/lib/const'

const SettingsButton = () => {
	const global = getGlobal()
	const { setSampleDifficulty } = getActions()

	const [isModalOpen, setIsModalOpen] = createSignal(false)
	const [modalPosition, setModalPosition] = createSignal<XY | undefined>(
		undefined,
	)
	const [modalActions, setModalActions] = createSignal<
		ModalAction[] | undefined
	>(undefined)
	const [isIconRotated, setIsIconRotated] = createSignal(false)

	let buttonRef: HTMLDivElement | undefined

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

	const handleClose = () => {
		setModalActions(initialActions)
		setIsModalOpen(false)
	}

	const initialActions: ModalAction[] = [
		{
			title: 'difficulty',
			Icon: BarsIcon,
			onClick: () => setModalActions(difficultyActions()),
		},
		{
			title: 'language',
			Icon: LanguageIcon,
			onClick: () => setModalActions(languageActions),
		},
	]

	const handleSetDifficulty = (difficulty: SampleDifficultyType) => {
		setSampleDifficulty(difficulty)
	}

	const difficultyActions = createMemo(() =>
		Object.entries(SampleDifficulty).map(([key, value]) => ({
			title: key.toLowerCase(),
			isSelected: global.difficulty === value,
			onClick: () => handleSetDifficulty(value),
		})),
	)

	// Needed to sync modal selected actions state with global state, should refactor somehow
	createEffect(
		on(
			() => global.difficulty,
			() => {
				setModalActions(difficultyActions())
			},
		),
	)

	const languageActions: ModalAction[] = [
		{
			title: 'english',
			isSelected: global.lang === 'en',
		},
		{
			title: 'german',
		},
	]

	onMount(() => {
		setModalActions(initialActions)
	})

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
				onClose={handleClose}
				onBeforeClose={() => setIsIconRotated(false)}
				actions={modalActions()}
				position={modalPosition()}
				centered
			/>
		</>
	)
}

export default SettingsButton
