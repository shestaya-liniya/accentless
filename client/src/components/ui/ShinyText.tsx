import './ShinyText.css'

interface OwnProps {
	text: string
	disabled?: boolean
	speed?: number
	class?: string
}

const ShinyText = (props: OwnProps) => {
	const animationDuration = `${props.speed}s`

	return (
		<div
			class={`shiny-text ${props.disabled ? 'disabled' : ''} ${props.class}`}
			style={{ 'animation-duration': animationDuration }}
		>
			{props.text}
		</div>
	)
}

export default ShinyText
