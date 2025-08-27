import type { Component } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'

export type RecognitionStatus =
	| 'inactive'
	| 'loading-sample'
	| 'sample-loaded'
	| 'recording'
	| 'processing'
	| 'success'
	| 'error'

export type Icon = Component<JSX.SvgSVGAttributes<SVGSVGElement>>

export type NoneToVoid = () => void

export type XY = {
	x: number
	y: number
}
