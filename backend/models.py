from pydantic import BaseModel


class TextPayload(BaseModel):
    text: str
    ngram_size: int = 2
