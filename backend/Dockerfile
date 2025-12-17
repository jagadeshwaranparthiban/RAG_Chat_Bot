FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VENV_PATH=/opt/venv

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmagic1 \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv "$VENV_PATH"
ENV PATH="$VENV_PATH/bin:$PATH"

# Install dependencies (kept in a separate layer for cache reuse)
RUN <<'EOF' > /tmp/requirements.txt
fastapi
uvicorn
python-multipart
langchain-community
langchain-text-splitters
sentence-transformers
chromadb
pypdf
docx2txt
EOF

RUN pip install --upgrade pip && pip install --no-cache-dir -r /tmp/requirements.txt


FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VENV_PATH=/opt/venv

# Runtime-only OS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder "$VENV_PATH" "$VENV_PATH"
ENV PATH="$VENV_PATH/bin:$PATH"

WORKDIR /app
COPY . /app

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
