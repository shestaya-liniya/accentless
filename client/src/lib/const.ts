export const SampleDifficulty = {
	EASY: 1,
	MEDIUM: 2,
	HARD: 3,
}
export type SampleDifficultyType =
	(typeof SampleDifficulty)[keyof typeof SampleDifficulty]
