import { createEffect, createSignal, For, on, type ParentProps } from 'solid-js'
import { Portal, Show } from 'solid-js/web'

import styles from './Modal.module.scss'
import Tappable from '@/components/ui/Tappable'
import type { Icon, NoneToVoid, XY } from '@/lib/type'

export type ModalAction<T = string> = {
	title: T
	Icon?: Icon
	onClick?: NoneToVoid
	isSelected?: boolean
	closeOnClick?: boolean
	isDisabled?: boolean
}

type ClosingState = {
	value: boolean
	afterActionClick?: boolean
}

type OwnProps = ParentProps<{
	isOpen: boolean
	onClose: NoneToVoid
	onBeforeClose?: NoneToVoid
	position?: XY
	actions?: ModalAction[]
	visibleBackdrop?: boolean
	centered?: boolean
	fullscreen?: boolean
}>

const FAST_DURATION = 200
const SLOW_DURATION = 300

const Modal = (props: OwnProps) => {
	const [isClosing, setIsClosing] = createSignal<ClosingState>({
		value: false,
		afterActionClick: false,
	})

	const handleClose = (afterActionClick = false, shouldCallOnClose = true) => {
		setIsClosing({
			value: true,
			afterActionClick,
		})

		props.onBeforeClose?.()

		setTimeout(
			() => {
				if (shouldCallOnClose) {
					props.onClose?.()
				}

				setIsClosing({
					value: false,
					afterActionClick: false,
				})
			},
			afterActionClick ? SLOW_DURATION : FAST_DURATION,
		)
	}

	createEffect(
		on(
			() => props.isOpen,
			isOpen => {
				if (!isOpen) {
					handleClose(false, false)
				}
			},
			{ defer: true },
		),
	)

	const renderAction = (action: ModalAction) => {
		const closeOnClick = action.closeOnClick ?? false

		const handleClick = () => {
			action.onClick?.()
			if (closeOnClick) {
				handleClose(true)
			}
		}

		return (
			<Tappable
				onClick={handleClick}
				class="inline-flex items-center gap-3 px-4 py-3 capitalize text-[15px]"
				classList={{
					'bg-accent': action.isSelected ?? false,
					'justify-center': !action.Icon,
				}}
			>
				<Show when={action.Icon}>{action.Icon?.({ class: `h-5 w-5` })}</Show>
				<div>{action.title}</div>
			</Tappable>
		)
	}

	return (
		<Show when={props.isOpen || isClosing().value}>
			<Portal mount={document.querySelector('#modals-root') || undefined}>
				<div
					class="absolute top-0 left-0 h-screen w-screen z-50 transition-height duration-300 ease-in-out text-white"
					onClick={() => handleClose()}
					classList={{
						[styles.backdrop]: props.visibleBackdrop,
						[styles.closing]: isClosing().value,
					}}
				>
					<div
						class="absolute bg-button backdrop-blur-md rounded-lg animate-fadeIn-scale border-primary"
						style={
							props.fullscreen
								? `top: 50%; left: 50%; transform: translate(-50%, -50%) !important`
								: `top: ${props.position?.y}px; left: ${props.position?.x}px;`
						}
						onClick={e => e.stopPropagation()}
						classList={{
							[styles.closingSlow]:
								isClosing().value && isClosing().afterActionClick,
							[styles.closing]: isClosing().value,
							'-translate-x-1/2': props.centered,
						}}
					>
						<Show when={props.actions}>
							<div class="flex flex-col rounded-lg overflow-hidden divide-y divide-border">
								<For each={props.actions}>{action => renderAction(action)}</For>
							</div>
						</Show>
						{props.children}
					</div>
				</div>
			</Portal>
		</Show>
	)
}
export default Modal
