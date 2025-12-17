from langchain_community.document_loaders import TextLoader, PyPDFLoader, Docx2txtLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from tempfile import NamedTemporaryFile
from typing import List, Tuple
from pathlib import Path
import json


def extract_heading(text: str, fallback: str) -> str:
    """Use the first non-empty line as heading, otherwise fallback."""
    for line in text.splitlines():
        stripped = line.strip()
        if stripped:
            return stripped
    return fallback


def _load_file(name: str, content: bytes):
    """Persist file content to disk and load documents based on extension."""
    suffix = Path(name or "").suffix.lower()
    if suffix not in {".pdf", ".docx", ".doc", ".txt"}:
        raise ValueError(
            f"Unsupported file type: {suffix or 'unknown'}; use pdf/docx/doc/txt."
        )

    # Write to a temp file so loaders can read from disk.
    with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    if suffix == ".pdf":
        loader = PyPDFLoader(tmp_path)
    elif suffix in {".docx", ".doc"}:
        loader = Docx2txtLoader(tmp_path)
    else:  # ".txt"
        loader = TextLoader(tmp_path, encoding="utf-8")

    docs = loader.load()
    return docs


def process_query(query: str, uploads: List[Tuple[str, bytes]]):
    """
    Build a vector store for the provided uploads and answer the query.

    uploads: list of (filename, bytes)
    """
    cleaned_query = (query or "").strip()
    if not cleaned_query:
        raise ValueError("Query must not be empty.")
    if not uploads:
        raise ValueError("At least one file is required.")

    documents = []
    for name, blob in uploads:
        documents.extend(_load_file(name, blob))

    if not documents:
        raise ValueError("No readable content found.")

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    vectorstore = Chroma.from_documents(chunks, embeddings)

    results = vectorstore.similarity_search(cleaned_query)

    try:
        from transformers import pipeline
        # Use flan-t5-base (small, free, fast)
        llm = pipeline("text2text-generation", model="google/flan-t5-base")
        # Concatenate top results as context
        context = "\n\n".join([r.page_content for r in results])
        # Truncate context to fit within ~3500 characters (approx 512 tokens)
        max_context_chars = 3500
        if len(context) > max_context_chars:
            context = context[:max_context_chars]
        prompt = f"Answer the following question using only the context below.\n\nContext:\n{context}\n\nQuestion: {cleaned_query}\n\nAnswer:"
        llm_response = llm(prompt, max_new_tokens=256)[0]["generated_text"]
    except Exception as e:
        llm_response = f"LLM error: {e}. Showing top retrieved chunks only."

    payload = {
        "results": [],
        "total_results": len(results),
        "total_chunks": len(chunks),
        "total_documents": len(documents),
        "llm_answer": llm_response,
    }

    for idx, result in enumerate(results, start=1):
        heading = extract_heading(result.page_content, f"Result {idx}")
        payload["results"].append(
            {
                "heading": heading,
                "gist": None,
                "main_content": result.page_content,
                "sub_sections": [
                    {
                        "sub_heading": heading,
                        "content": result.page_content,
                    }
                ],
            }
        )

    return payload