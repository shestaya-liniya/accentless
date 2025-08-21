import type { JSX } from 'solid-js'
import { twMerge } from 'tailwind-merge'

import styles from './Tappable.module.scss'

type OwnProps = {
	onClick?: (e: MouseEvent) => void
	onPointerDown?: () => void
	children?: JSX.Element
	class?: string
	classList?: Record<string, boolean>
	fullWidth?: boolean
	forceRipple?: boolean
}

const Tappable = (props: OwnProps) => {
	let containerRef: HTMLDivElement | undefined

	const handleClick = (e: MouseEvent) => {
		props.onClick?.(e)
	}

	const handlePointerDown = (e: MouseEvent) => {
		if (props.onClick || props.onPointerDown || props.forceRipple) {
			handleRippleAnimation(e)
			props.onPointerDown?.()
		}
	}

	const handleRippleAnimation = (e: MouseEvent) => {
		if (!containerRef) return

		const rect = containerRef.getBoundingClientRect()
		const diameter = Math.max(
			containerRef.clientWidth,
			containerRef.clientHeight,
		)
		const radius = diameter / 2

		const rippleCircle = document.createElement('span')
		rippleCircle.style.width = rippleCircle.style.height = `${diameter}px`
		rippleCircle.classList.add(styles.ripple)

		rippleCircle.style.left = `${e.clientX - rect.left - radius}px`
		rippleCircle.style.top = `${e.clientY - rect.top - radius}px`

		containerRef.appendChild(rippleCircle)

		setTimeout(() => {
			if (rippleCircle.parentNode) {
				rippleCircle.remove()
			}
		}, 500)
	}

	const containerClass = twMerge(
		'relative overflow-hidden cursor-pointer',
		props.class,
		props.fullWidth ? 'flex w-full' : 'inline-flex',
	)

	return (
		<div
			onClick={handleClick}
			onPointerDown={handlePointerDown}
			ref={containerRef}
			class={containerClass}
			classList={props.classList}
		>
			{props.children}
		</div>
	)
}

export default Tappable
