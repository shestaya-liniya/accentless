import z from 'zod'

export const PronunciationAssessmentSchema = z.object({
	AccuracyScore: z.number(),
	FluencyScore: z.number().optional(),
	CompletenessScore: z.number().optional(),
	PronScore: z.number().optional(),
	ErrorType: z.string().optional(),
})

export const PhonemeItemSchema = z.object({
	Phoneme: z.string(),
	PronunciationAssessment: PronunciationAssessmentSchema,
	Offset: z.number(),
	Duration: z.number(),
})

export const SyllableItemSchema = z.object({
	Syllable: z.string(),
	Grapheme: z.string().optional(),
	PronunciationAssessment: PronunciationAssessmentSchema,
	Offset: z.number(),
	Duration: z.number(),
})

export const WordItemSchema = z.object({
	Word: z.string(),
	Offset: z.number(),
	Duration: z.number(),
	PronunciationAssessment: PronunciationAssessmentSchema,
	Syllables: z.array(SyllableItemSchema).optional(),
	Phonemes: z.array(PhonemeItemSchema).optional(),
})

export const NBestItemSchema = z.object({
	Confidence: z.number(),
	Lexical: z.string(),
	ITN: z.string(),
	MaskedITN: z.string(),
	Display: z.string(),
	PronunciationAssessment: PronunciationAssessmentSchema,
	Words: z.array(WordItemSchema),
})

export const PronunciationAssessmentPhonemeGranularityResultSchema = z.object({
	Id: z.string(),
	RecognitionStatus: z.string(),
	Offset: z.number(),
	Duration: z.number(),
	Channel: z.number(),
	DisplayText: z.string(),
	SNR: z.number(),
	NBest: z.array(NBestItemSchema),
})

export type PronAsmPhonemeResponse = z.infer<
	typeof PronunciationAssessmentPhonemeGranularityResultSchema
>
