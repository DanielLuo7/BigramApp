from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter

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
@app.post("/bigrams")
def extract_bigrams(payload: TextPayload):
    text = payload.text
    words = re.findall(r'\b\w+\b', text.lower())
    print("words", words)
    bigrams = Counter(zip(words, words[1:]))
    res_body = {" ".join(key): value for key, value in bigrams.items()}
    return JSONResponse(content=res_body)
