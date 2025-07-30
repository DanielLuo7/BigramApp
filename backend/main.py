from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from collections import deque, defaultdict

from typing import List
from models import TextPayload

import re

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
def extract_bigrams(payload: TextPayload, n: int = Query(2)):
    text = payload.text
    words: List[str] = re.findall(r'\b\w+\b', text.lower())

    if n > len(words):
        return JSONResponse(status_code=400, 
                            content={ "error": f"Ngram size can't be greater than length of text" })

    ngram = deque(maxlen=n)
    ngrams = defaultdict(int)

    # use sliding window to get ngrams
    for word in words:
        ngram.append(word) 
        if len(ngram) == n:
            ngrams[" ".join(ngram)] += 1

    return JSONResponse(content=ngrams)
