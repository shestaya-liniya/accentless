import type { SampleDifficultyType } from '@/lib/type'

export type GetSampleRequestBody = {
	category: SampleDifficultyType
	language: string
}

export type GetSampleResponse = {
	real_transcript: string[]
	ipa_transcript: string
	transcript_translation: string
}

export type GetAccuracyFromRecordedAudioBody = {
	base64Audio: string
	language: 'en'
	title: string
}

/* "real_transcript": " It's against my morals",
  "ipa_transcript": "ɪts əˈgɛnst maɪ ˈmɔrəlz",
  "pronunciation_accuracy": "100",
  "real_transcripts": "It's against my morals.",
  "matched_transcripts": "It's against my morals",
  "real_transcripts_ipa": "ɪts əˈgɛnst maɪ ˈmɔrəlz.",
  "matched_transcripts_ipa": "ɪts əˈgɛnst maɪ ˈmɔrəlz",
  "pair_accuracy_category": "0 0 0 0",
  "start_time": "0.0 0.59 0.91 1.17",
  "end_time": "0.69 1.01 1.27 1.63",
  "is_letter_correct_all_words": "1111 1111111 11 1111111 " */

export type GetAccuracyFromRecordedAudioResponse = {
	real_transcript: string
	ipa_transcript: string
	pronunciation_accuracy: string
	real_transcripts: string
	matched_transcripts: string
	real_transcripts_ipa: string
	matched_transcripts_ipa: string
	pair_accuracy_category: string
	start_time: string
	end_time: string
	is_letter_correct_all_words: string
}
