"""
IRIS web backend (Render edition)

One Flask service that:
  * serves the IRIS frontend from ./public
  * exposes  GET  /api/ping   -> health check
  * exposes  POST /api/chat   -> asks an Ollama server and returns {reply}

Ollama is configured with environment variables (see README.md):
  OLLAMA_HOST     default https://ollama.com   (Ollama Cloud; or your own server)
  OLLAMA_API_KEY  required for ollama.com      (keep it secret, set it in Render)
  OLLAMA_MODEL    default gpt-oss:120b

The desktop-only features from the original app (open apps, shutdown, lock,
server screenshots, PC stats) are intentionally NOT here: they can't work on
a hosted server and would be dangerous on a public URL.
"""

import os
import time
import threading
from collections import defaultdict, deque

import requests
from flask import Flask, abort, jsonify, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")

# Website files are looked up next to app.py first, then in ./public, so the
# site works whether or not the files sit inside a "public" folder (and a newly
# uploaded top-level copy always wins over an older one).
SITE_FILES = {"index.html", "style.css", "script.js", "config.js"}

app = Flask(__name__, static_folder=None)


def _send_site_file(name):
    for folder in (BASE_DIR, PUBLIC_DIR):
        if os.path.isfile(os.path.join(folder, name)):
            return send_from_directory(folder, name)
    abort(404)

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "https://ollama.com").rstrip("/")
OLLAMA_API_KEY = os.environ.get("6f41b1b265f240edb3630825b023bd14", "").strip()
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "gpt-oss:120b")

# Abuse protection: this is a public URL that spends your Ollama quota.
PER_IP_LIMIT = int(os.environ.get("RATE_LIMIT_PER_MIN", "12"))     # requests / minute / visitor
GLOBAL_LIMIT = int(os.environ.get("GLOBAL_LIMIT_PER_MIN", "120"))  # requests / minute / everyone
MAX_MESSAGE_CHARS = 1000
MAX_HISTORY = 10

SYSTEM_PROMPT = (
    "You are IRIS (Intelligent Response & Interface System), a concise, friendly "
    "voice-style assistant with a slightly futuristic tone. Keep answers short "
    "(a few sentences) unless the user asks for detail. You cannot control the "
    "user's computer or open apps; if asked, say the web version can't do that."
)

_hits = defaultdict(deque)
_global_hits = deque()
_lock = threading.Lock()


def _client_ip():
    forwarded = request.headers.get("X-Forwarded-For", "")
    return (forwarded.split(",")[0].strip() or request.remote_addr or "unknown")


def _allow(ip):
    """Sliding-window limiter (per visitor + global). Returns True if allowed."""
    now = time.time()
    with _lock:
        while _global_hits and now - _global_hits[0] > 60:
            _global_hits.popleft()
        q = _hits[ip]
        while q and now - q[0] > 60:
            q.popleft()
        if len(q) >= PER_IP_LIMIT or len(_global_hits) >= GLOBAL_LIMIT:
            return False
        q.append(now)
        _global_hits.append(now)
        # keep the dict from growing forever
        if len(_hits) > 5000:
            for k in [k for k, v in _hits.items() if not v]:
                del _hits[k]
        return True


@app.get("/")
def index():
    return _send_site_file("index.html")


@app.get("/<path:name>")
def site_file(name):
    if name in SITE_FILES:
        return _send_site_file(name)
    abort(404)


@app.get("/api/ping")
def ping():
    return jsonify({"status": "ok"})


@app.post("/api/chat")
def chat():
    if OLLAMA_HOST.startswith("https://ollama.com") and not OLLAMA_API_KEY:
        return jsonify({"error": "AI is not configured on this server (missing OLLAMA_API_KEY)."}), 503

    if not _allow(_client_ip()):
        return jsonify({"error": "Too many requests. Please wait a moment and try again."}), 429

    data = request.get_json(silent=True) or {}
    message = str(data.get("message", "")).strip()[:MAX_MESSAGE_CHARS]
    if not message:
        return jsonify({"error": "Empty message."}), 400

    now = " ".join(str(data.get("now", "")).split())[:60]
    system = SYSTEM_PROMPT + (f" The user's current local date and time: {now}." if now else "")

    messages = [{"role": "system", "content": system}]
    history = data.get("history", [])
    if isinstance(history, list):
        for m in history[-MAX_HISTORY:]:
            if not isinstance(m, dict):
                continue
            text = str(m.get("text", "")).strip()[:MAX_MESSAGE_CHARS]
            if text:
                role = "user" if m.get("role") == "user" else "assistant"
                messages.append({"role": role, "content": text})
    messages.append({"role": "user", "content": message})

    headers = {"Content-Type": "application/json"}
    if OLLAMA_API_KEY:
        headers["Authorization"] = f"Bearer {OLLAMA_API_KEY}"

    try:
        r = requests.post(
            f"{OLLAMA_HOST}/api/chat",
            json={"model": OLLAMA_MODEL, "messages": messages, "stream": False},
            headers=headers,
            timeout=60,
        )
        r.raise_for_status()
        reply = (r.json().get("message", {}).get("content") or "").strip()
        if not reply:
            raise ValueError("empty reply from model")
        return jsonify({"reply": reply})
    except requests.Timeout:
        return jsonify({"error": "The AI took too long to respond. Try again."}), 504
    except Exception as exc:  # log details server-side, keep the client message generic
        app.logger.error("Ollama request failed: %s", exc)
        return jsonify({"error": "The AI service is unavailable right now."}), 502


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    print(f"IRIS running at http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port)
