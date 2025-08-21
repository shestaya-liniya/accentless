import type { SampleDifficulty } from "@/lib/const"
import type { Component } from "solid-js"
import type { JSX } from "solid-js/jsx-runtime"

export type SampleDifficultyType =
	(typeof SampleDifficulty)[keyof typeof SampleDifficulty]

export type Icon = Component<JSX.SvgSVGAttributes<SVGSVGElement>>

export type NoneToVoid = () => void

export type XY = {
	x: number
	y: number
}
