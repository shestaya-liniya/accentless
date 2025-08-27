export type GetAccuracyFromRecordedAudioBody = {
	audio_data: Blob
	sample_text: string
}

export interface GetAccuracyFromRecordedAudioResponse {
	DisplayText: string
	Duration: number
	NBest: NBestItem[]
	Offset: number
	RecognitionStatus:
		| 'Success'
		| 'NoMatch'
		| 'InitialSilenceTimeout'
		| 'BabbleTimeout'
		| 'Error'
	SNR: number
}

export interface NBestItem {
	AccuracyScore: number
	CompletenessScore: number
	Confidence: number
	Display: string
	FluencyScore: number
	ITN: string
	Lexical: string
	MaskedITN: string
	PronScore: number
	ProsodyScore: number
	Words: WordAssessment[]
}

export interface WordAssessment {
	AccuracyScore: number
	Confidence: number
	Duration: number
	ErrorType: string
	Feedback: Feedback
	Offset: number
	Phonemes: PhonemeAssessment[]
	Syllables: SyllableAssessment[]
	Word: string
}

export interface Feedback {
	Prosody: {
		Break: {
			BreakLength: number
			ErrorTypes: string[]
			MissingBreak?: { Confidence: number }
			UnexpectedBreak?: { Confidence: number }
		}
		Intonation: {
			ErrorTypes: string[]
			Monotone: {
				Confidence: number
				SyllablePitchDeltaConfidence: number
				WordPitchSlopeConfidence: number
			}
		}
	}
}

export interface PhonemeAssessment {
	AccuracyScore: number
	Duration: number
	NBestPhonemes: NBestPhoneme[]
	Offset: number
	Phoneme: string
}

export interface NBestPhoneme {
	Phoneme: string
	Score: number
}

export interface SyllableAssessment {
	AccuracyScore: number
	Duration: number
	Grapheme: string
	Offset: number
	Syllable: string
}
