import type { Component, JSX } from 'solid-js'

export const SampleDifficulty = {
	EASY: 1,
	MEDIUM: 2,
	HARD: 3,
}
export type SampleDifficultyType =
	(typeof SampleDifficulty)[keyof typeof SampleDifficulty]

export type Icon = Component<JSX.SvgSVGAttributes<SVGSVGElement>>

export type NoneToVoid = () => void

export type XY = {
	x: number
	y: number
}
