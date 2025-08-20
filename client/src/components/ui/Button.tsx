import Tappable from '@/components/ui/Tappable'
import type { ParentProps } from 'solid-js'

type OwnProps = ParentProps<{
	onClick: () => void
}>

const Button = (props: OwnProps) => {
	return (
		<Tappable
			onClick={props.onClick}
			class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-button border-primary"
		>
			{props.children}
		</Tappable>
	)
}

export default Button
