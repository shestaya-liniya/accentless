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
	}): Promise<{
		ok: boolean
		result?: PronAsmPhonemeResponse
	}> {
		const speechConfig = sdk.SpeechConfig.fromSubscription(
			this.subscriptionKey,
			this.region,
		)
		speechConfig.speechRecognitionLanguage = 'en-US'

		const audioArrayBuffer = await payload.audioFile.arrayBuffer()
		const pushStream = sdk.AudioInputStream.createPushStream()
		pushStream.write(audioArrayBuffer)
		pushStream.close()

		const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream)

		const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

		const pronAsmConfig = new sdk.PronunciationAssessmentConfig(
			payload.referenceText,
			sdk.PronunciationAssessmentGradingSystem.HundredMark,
			sdk.PronunciationAssessmentGranularity.Phoneme,
			true,
		)
		pronAsmConfig.phonemeAlphabet = 'IPA'
		pronAsmConfig.applyTo(recognizer)

		return new Promise<{
			ok: boolean
			result?: PronAsmPhonemeResponse
		}>((resolve, reject) => {
			let resultReceived = false

			const timeout = setTimeout(() => {
				if (!resultReceived) {
					recognizer.stopContinuousRecognitionAsync(() => recognizer.close())
					resolve({
						ok: false,
					})
				}
			}, 15_000)

			recognizer.recognized = (s, e) => {
				if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
					resultReceived = true
					clearTimeout(timeout)
					recognizer.stopContinuousRecognitionAsync(() => recognizer.close())

					try {
						const rawJson = JSON.parse(
							e.result.properties.getProperty(
								sdk.PropertyId.SpeechServiceResponse_JsonResult,
							),
						)

						const validatedJson =
							PronunciationAssessmentPhonemeGranularityResultSchema.safeParse(
								rawJson,
							)

						if (!validatedJson.success) {
							recognizer.stopContinuousRecognitionAsync(() =>
								recognizer.close(),
							)
							resolve({
								ok: false,
							})
						}

						resolve({
							ok: true,
							result: validatedJson.data,
						})
					} catch (err) {
						reject(err)
					}
				}
			}

			recognizer.startContinuousRecognitionAsync()
		})
	}
}

export default PronunciationAssessmentService
