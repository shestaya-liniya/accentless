from modules import ModelInterfaces
import eng_to_ipa

class EngPhonemConverter(ModelInterfaces.ITextToPhonemModel):
    def __init__(self,) -> None:
        super().__init__()

    def convertToPhonem(self, sentence: str) -> str:
        phonem_representation = eng_to_ipa.convert(sentence)
        phonem_representation = phonem_representation.replace('*','')

        return phonem_representation

def get_phonem_converter(language: str):
    if language == 'en':
        phonem_converter = EngPhonemConverter()
    else:
        raise ValueError('Language not implemented')

    return phonem_converter