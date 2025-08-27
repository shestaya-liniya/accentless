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

export const SampleMaxWords: Record<SampleDifficultyType, number> = {
	[SampleDifficulty.EASY]: 5,
	[SampleDifficulty.MEDIUM]: 15,
	[SampleDifficulty.HARD]: 40,
}
