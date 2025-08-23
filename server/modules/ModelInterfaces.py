
import abc

class ITextToPhonemModel(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, subclass):
        return (hasattr(subclass, 'convertToPhonem') and
                callable(subclass.convertToPhonem))

    @abc.abstractmethod
    def convertToPhonem(self, str) -> str:
        """Convert sentence to phonemes"""
        raise NotImplementedError
