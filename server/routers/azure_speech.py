import os
import requests
import base64
import uuid
import azure.cognitiveservices.speech as speechsdk
from flask import Blueprint, request, jsonify, make_response
from dotenv import load_dotenv

load_dotenv()

azure_router = Blueprint('azure_speech', __name__, url_prefix='/api/azure')

subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY")
region = os.getenv("AZURE_REGION")
language = "en-US"
voice = "Microsoft Server Speech Text to Speech Voice (en-US, JennyNeural)"

WaveHeader16K16BitMono = bytes(
    [
        82,
        73,
        70,
        70,
        78,
        128,
        0,
        0,
        87,
        65,
        86,
        69,
        102,
        109,
        116,
        32,
        18,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        128,
        62,
        0,
        0,
        0,
        125,
        0,
        0,
        2,
        0,
        16,
        0,
        0,
        0,
        100,
        97,
        116,
        97,
        0,
        0,
        0,
        0,
    ]
)

@azure_router.route("/getToken", methods=["POST"])
def gettoken():
    # Token is needed to communicate with Azure API client side, for example in case of real time recognition 
    fetch_token_url = 'https://%s.api.cognitive.microsoft.com/sts/v1.0/issueToken' %region
    headers = {
        'Ocp-Apim-Subscription-Key': subscription_key
    }
    response = requests.post(fetch_token_url, headers=headers)
    access_token = response.text
    return jsonify({"at":access_token})

@azure_router.route("/analyzeSpeech", methods=["POST"])
def analyzeSpeech():
    f = request.files['audio_data']
    reference_text = request.form.get("sample_text")

    # a generator which reads audio data chunk by chunk
    # the audio_source can be any audio input stream which provides read() method, e.g. audio file, microphone, memory stream, etc.
    def get_chunk(audio_source, chunk_size=1024):
        yield WaveHeader16K16BitMono
        while True:
            chunk = audio_source.read(chunk_size)
            if not chunk:
                break
            yield chunk

    # build pronunciation assessment parameters
    enable_prosody_assessment = True
    phoneme_alphabet = "IPA"  # IPA or SAPI
    enable_miscue = True
    nbest_phoneme_count = 5
    pron_assessment_params_json = (
        '{"GradingSystem":"HundredMark","Dimension":"Comprehensive","ReferenceText":"%s","EnableProsodyAssessment":"%s",'
        '"PhonemeAlphabet":"%s","EnableMiscue":"%s","NBestPhonemeCount":"%s"}'
        % (reference_text, enable_prosody_assessment, phoneme_alphabet, enable_miscue, nbest_phoneme_count)
    )
    pron_assessment_params_base64 = base64.b64encode(bytes(pron_assessment_params_json, "utf-8"))
    pron_assessment_params = str(pron_assessment_params_base64, "utf-8")

    # https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-get-speech-session-id#provide-session-id-using-rest-api-for-short-audio
    session_id = uuid.uuid4().hex

    # build request
    url = f"https://{region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1"
    url = f"{url}?format=detailed&language={language}&X-ConnectionId={session_id}"
    headers = {
        "Accept": "application/json;text/xml",
        "Connection": "Keep-Alive",
        "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
        "Ocp-Apim-Subscription-Key": subscription_key,
        "Pronunciation-Assessment": pron_assessment_params,
        "Transfer-Encoding": "chunked",
        "Expect": "100-continue",
    }

    audioFile = f
    # send request with chunked data
    response = requests.post(url=url, data=get_chunk(audioFile), headers=headers)
    audioFile.close()

    return response.json()

@azure_router.route("/gettts", methods=["POST"])
def gettts():
    reftext = request.form.get("reftext")
    # Creates an instance of a speech config with specified subscription key and service region.
    speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
    speech_config.speech_synthesis_voice_name = voice

    offsets=[]

    def wordbound(evt):
        offsets.append( evt.audio_offset / 10000)

    # Creates a speech synthesizer with a null output stream.
    # This means the audio output data will not be written to any output channel.
    # You can just get the audio from the result.
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

    # Subscribes to word boundary event
    # The unit of evt.audio_offset is tick (1 tick = 100 nanoseconds), divide it by 10,000 to convert to milliseconds.
    speech_synthesizer.synthesis_word_boundary.connect(wordbound)

    result = speech_synthesizer.speak_text_async(reftext).get()
    # Check result
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        #print("Speech synthesized for text [{}]".format(reftext))
        #print(offsets)
        audio_data = result.audio_data
        #print(audio_data)
        #print("{} bytes of audio data received.".format(len(audio_data)))
        
        response = make_response(audio_data)
        response.headers['Content-Type'] = 'audio/wav'
        response.headers['Content-Disposition'] = 'attachment; filename=sound.wav'
        # response.headers['reftext'] = reftext
        response.headers['offsets'] = offsets
        return response
        
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech synthesis canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))
        return jsonify({"success":False})

@azure_router.route("/getttsforword", methods=["POST"])
def getttsforword():
    word = request.form.get("word")

    # Creates an instance of a speech config with specified subscription key and service region.
    speech_config = speechsdk.SpeechConfig(subscription=subscription_key, region=region)
    speech_config.speech_synthesis_voice_name = voice

    # Creates a speech synthesizer with a null output stream.
    # This means the audio output data will not be written to any output channel.
    # You can just get the audio from the result.
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

    result = speech_synthesizer.speak_text_async(word).get()
    # Check result
    if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
        #print("Speech synthesized for text [{}]".format(reftext))
        #print(offsets)
        audio_data = result.audio_data
        #print(audio_data)
        #print("{} bytes of audio data received.".format(len(audio_data)))
        
        response = make_response(audio_data)
        response.headers['Content-Type'] = 'audio/wav'
        response.headers['Content-Disposition'] = 'attachment; filename=sound.wav'
        # response.headers['word'] = word
        return response
        
    elif result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = result.cancellation_details
        print("Speech synthesis canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))
        return jsonify({"success":False})
