# IRIS — web edition (Render)

One Flask service that serves the IRIS interface and an `/api/chat` endpoint
backed by **Ollama**. Weather, translate, calculator, tasks, reminders,
screenshot (your own screen) and voice input run in the visitor's browser.

## Deploy on Render

1. Create an Ollama API key at https://ollama.com/settings/keys
2. Put this folder in a GitHub repo (the files in this folder at the repo root).
3. In Render: **New → Blueprint**, pick the repo (it reads `render.yaml`).
4. When asked, paste your key as `OLLAMA_API_KEY`. Deploy.

Your site will be at `https://iris-xxxx.onrender.com`. On the free plan it
sleeps after ~15 min idle and takes ~30–60 s to wake.

## Settings (Render → Environment)

| Variable | Default | Purpose |
|---|---|---|
| `OLLAMA_API_KEY` | – | Ollama Cloud key (secret) |
| `OLLAMA_HOST` | `https://ollama.com` | Ollama server URL |
| `OLLAMA_MODEL` | `gpt-oss:120b` | Any model your host offers (see `https://ollama.com/api/tags`) |
| `RATE_LIMIT_PER_MIN` | `12` | Chat requests per visitor per minute |
| `GLOBAL_LIMIT_PER_MIN` | `120` | Chat requests per minute across everyone |

### Using your own Ollama instead of Ollama Cloud
Set `OLLAMA_HOST` to your server's public URL (e.g. a Cloudflare Tunnel to
your PC running `ollama serve`), `OLLAMA_MODEL` to e.g. `llama3.2`, and leave
`OLLAMA_API_KEY` empty. Your PC must be on whenever the site is used.
Running Ollama *on* Render needs a paid instance with several GB of RAM.

## Run locally
    pip install -r requirements.txt
    export OLLAMA_API_KEY=your_key
    python app.py        # http://127.0.0.1:5000

## Not included (by design)
Open-app / shutdown / lock / server screenshot / PC stats from the desktop
version — they can't work on a hosted Linux server and would be unsafe on a
public URL. The desktop app is unchanged.
