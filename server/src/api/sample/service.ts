import { toIPA } from 'phonemize'

import {
	type SampleDifficultyType,
	type SampleWithIPA,
	SampleWords,
	type WordCount,
} from './type'

const EN_SENTENCES_FILE = 'sentences/data_en.csv'

class SampleService {
	private assetsFetcher: Fetcher
	private sentences: string[] = []

	constructor(assetsFetcher: Fetcher) {
		this.assetsFetcher = assetsFetcher
	}

	private countWords(sentence: string): number {
		return sentence
			.trim()
			.split(/\s+/)
			.filter(word => word.length > 0).length
	}

	private getSentencesByDifficulty(count: WordCount): string[] {
		return this.sentences.filter(sentence => {
			const wordCount = this.countWords(sentence)
			return wordCount >= count.from && wordCount <= count.to
		})
	}

	private getRandomSentenceByDifficulty(count: WordCount): string {
		const filteredSentences = this.getSentencesByDifficulty(count)

		const randomIndex = Math.floor(Math.random() * filteredSentences.length)
		return filteredSentences[randomIndex]
	}

	async getSample(difficulty: SampleDifficultyType): Promise<SampleWithIPA> {
		const wordCount = SampleWords[difficulty]

		const response = await this.assetsFetcher.fetch(
			'http://localhost/' + EN_SENTENCES_FILE,
		)

		if (!response.ok) {
			throw new Error('Failed to load sentences CSV')
		}

		const csvContent = await response.text()

		this.sentences = csvContent
			.split('\n')
			.slice(1) // skip header
			.filter(line => line.trim())
			.map(sentence => sentence.trim())

		const sentence = this.getRandomSentenceByDifficulty(wordCount)

		const ipa = toIPA(sentence, {
			stripStress: true,
		})

		return {
			text: sentence,
			ipa,
		}
	}
}

export default SampleService
