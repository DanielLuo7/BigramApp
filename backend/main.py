import re
from collections import defaultdict, deque
from typing import List, Optional

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import TextPayload

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # only local for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
Check app's health
"""


@app.get("/health")
def check_help():
    return {"health": "ok"}


"""
Returns a JSON body containing the count of all bigrams in input text
"""


@app.post("/ngrams")
def parse_ngrams(
    payload: TextPayload,
    n: int = Query(2),
    min_frequency: int = Query(1),
    k_most_frequent: int = Query(None),
    keywords: Optional[str] = Query(None),
):
    text = payload.text
    words: List[str] = re.findall(r"\b\w+\b", text.lower())

    if n > len(words):
        return JSONResponse(
            status_code=400,
            content={"error": f"Ngram size can't be greater than length of text"},
        )

    window = deque(maxlen=n)
    ngrams: defaultdict[str, int] = defaultdict(int)

    # use sliding window to get ngrams
    for word in words:
        window.append(word)
        if len(window) == n:
            ngrams[" ".join(window)] += 1

    if keywords:
        keywords = set([word for word in keywords.split(",")])
        response_content = {
            ngram: count
            for ngram, count in ngrams.items()
            if count >= min_frequency
            and any(word in keywords for word in ngram.split(" ")) # any ngram is in keyword set
        }
    else:
        response_content = {
            ngram: count for ngram, count in ngrams.items() if count >= min_frequency
        }

    if k_most_frequent:
        # sort by frequences in non increasing order. Get the first k ngrams
        k_most_frequent_ngrams = sorted(
            response_content, key=lambda x: x[1], reverse=True
        )[:k_most_frequent]
        response_content = {ngram: ngrams[ngram] for ngram in k_most_frequent_ngrams}

    return JSONResponse(content=response_content)
