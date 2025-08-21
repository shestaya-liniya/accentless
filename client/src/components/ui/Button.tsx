import type { ParentProps } from 'solid-js'
import { twMerge } from 'tailwind-merge'

import Tappable from '@/components/ui/Tappable'

type OwnProps = ParentProps<{
	onClick: () => void
	variant?: 'ghost'
	class?: string
}>

const Button = (props: OwnProps) => {
	const variant = props.variant ?? 'primary'

	const className = twMerge(
		'inline-flex items-center gap-2 px-4 py-2 rounded-full',
		props.class,
	)

	return (
		<Tappable
			onClick={props.onClick}
			class={className}
			classList={{
				'bg-button border-primary': variant === 'primary',
			}}
		>
			{props.children}
		</Tappable>
	)
}

export default Button
