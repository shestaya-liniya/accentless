import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

import {
	type PronAsmPhonemeResponse,
	PronunciationAssessmentPhonemeGranularityResultSchema,
} from './type'

class PronunciationAssessmentService {
	private subscriptionKey: string
	private region: string

	constructor(subscriptionKey: string, region: string) {
		this.subscriptionKey = subscriptionKey
		this.region = region
	}

	async performAssessment(payload: {
		referenceText: string
		audioFile: File
	}): Promise<PronAsmPhonemeResponse> {
		const speechConfig = sdk.SpeechConfig.fromSubscription(
			this.subscriptionKey,
			this.region,
		)
		speechConfig.speechRecognitionLanguage = 'en-US'

		// tRPC affecting how File is processed, cf worker as well affecting how File is processed, so should make research to resolve that
		// fromWavFileInput do not accept Uint8Array but it's somehow works
		const audioArrayBuffer = await payload.audioFile.arrayBuffer()
		const audioUint8Array = new Uint8Array(audioArrayBuffer)
		const audioConfig = sdk.AudioConfig.fromWavFileInput(
			audioUint8Array as unknown as File,
		)

		const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

		const pronAsmConfig = new sdk.PronunciationAssessmentConfig(
			payload.referenceText,
			sdk.PronunciationAssessmentGradingSystem.HundredMark,
			sdk.PronunciationAssessmentGranularity.Phoneme,
			true,
		)
		pronAsmConfig.phonemeAlphabet = 'IPA'
		pronAsmConfig.applyTo(recognizer)

		return new Promise<PronAsmPhonemeResponse>((resolve, reject) => {
			recognizer.recognizeOnceAsync(
				result => {
					recognizer.close()

					if (result.reason === sdk.ResultReason.RecognizedSpeech) {
						const rawJson = JSON.parse(
							result.properties.getProperty(
								sdk.PropertyId.SpeechServiceResponse_JsonResult,
							),
						)

						const validatedJson =
							PronunciationAssessmentPhonemeGranularityResultSchema.parse(
								rawJson,
							)

						resolve(validatedJson)
					} else {
						reject(new Error(`Recognition failed: ${result.reason}`))
					}
				},
				err => {
					recognizer.close()
					reject(err)
				},
			)
		})
	}
}

export default PronunciationAssessmentService
