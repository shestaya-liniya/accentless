export type SampleWithIPA = {
	text: string
	ipa: string
}

export const SampleDifficulty = {
	EASY: 1,
	MEDIUM: 2,
	HARD: 3,
} as const

export type SampleDifficultyType =
	(typeof SampleDifficulty)[keyof typeof SampleDifficulty]

export type WordCount = {
	from: number
	to: number
}

export const SampleWords = {
	[SampleDifficulty.EASY]: {
		from: 0,
		to: 10,
	},
	[SampleDifficulty.MEDIUM]: {
		from: 10,
		to: 20,
	},
	[SampleDifficulty.HARD]: {
		from: 20,
		to: 50,
	},
}
