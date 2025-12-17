from typing import List
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
import uvicorn

from rag_demo import process_query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RAG Demo Server")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/ask")
async def ask(
    query: str = Form(...), 
    files: List[UploadFile] = File(..., description="Upload pdf/docx/doc/txt files"),
):
    cleaned_query = (query or "").strip()
    if not cleaned_query:
        raise HTTPException(status_code=400, detail="Query must not be empty.")
    if not files:
        raise HTTPException(status_code=400, detail="At least one file is required.")

    uploads = []
    for upload in files:
        content = await upload.read()
        uploads.append((upload.filename or "uploaded_file", content))

    try:
        payload = process_query(cleaned_query, uploads)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return payload


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
