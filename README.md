# Open Dots

**A self-hosted AI workspace for chat, tools, and computer tasks.** Open Dots brings model conversations, a governed action gateway, approval prompts, connectors, and an optional isolated browser runtime into one local-first app.

Open Dots is an independent open-source project. It is not affiliated with or endorsed by OpenAI, xAI, or any model provider. “Dots” is used as a project name only; this project does not claim to reproduce an unreleased or undocumented product.

> **Status:** Prototype / active development. Intended for local experimentation; multi-user hosting and hostile-web isolation are not production ready.

## What it does

- Create assistant personas with separate instructions, model IDs, and visual identities.
- Stream chat responses, persist conversations locally, render Markdown, attach images, and dictate messages where the browser supports speech input.
- Connect to models through the included MUAPI adapter and choose from its configured model catalog.
- Request confined workspace reads and writes or computer actions through a deny-by-default gateway. Higher-risk actions pause for approval and produce audit events.
- Connect apps through Composio, with explicit OAuth and narrow GitHub issue lookup/create actions.
- Run an optional bot-scoped Docker/Playwright computer runtime or connect a compatible remote computer service.
- Keep application state in SQLite and encrypt provider credentials at rest.

## Quick start

### Requirements

- Node.js and npm
- Python 3.10+ and pip
- A MUAPI API key for live model responses

Clone and start the API:

```bash
git clone https://github.com/Anil-matcha/open-dots.git
cd open-dots/server
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
export MUAPI_API_KEY="your_muapi_api_key"
python run.py
```

The API is available at `http://127.0.0.1:8000`; interactive docs are at `/docs`.

In a second terminal, start the web client:

```bash
cd open-dots/client
npm install
npm run dev
```

Open `http://localhost:3000`. You can enter the provider key in App Settings instead of setting the environment variable. The server creates local session and encryption keys under its data directory on first start.

## Model provider

The included model adapter currently targets MUAPI's prediction API and upload endpoint. Model IDs come from the server catalog and must be supported by the configured MUAPI account. This is not yet a generic OpenAI-compatible provider interface.

| Variable | Default | Purpose |
| --- | --- | --- |
| `MUAPI_API_KEY` | empty | Provider key fallback when no key is saved in settings |
| `MUAPI_BASE_URL` | `https://api.muapi.ai/api/v1` | MUAPI API base URL |
| `DEFAULT_MODEL` | `gpt-5-mini` | Initial model for new assistants |
| `COMPOSIO_API_KEY` | empty | Optional connector credential |
| `DATA_DIR` | `~/.open-dots` | SQLite state and local keys |
| `APP_ENCRYPTION_KEY` | generated in `DATA_DIR` | Optional Fernet key for encrypted credentials |
| `APP_AUTH_TOKEN` | generated in `DATA_DIR` | Bearer token for direct or non-loopback API access |
| `WORKSPACE_ROOT` | project root | Directory boundary for approved workspace actions |
| `COMPUTER_PROVIDER` | `fake` | Computer provider: `fake`, `docker`, or `remote` |
| `HOST` / `PORT` | `127.0.0.1` / `8000` | API bind address |

For non-loopback access, set `APP_AUTH_TOKEN`, configure the client with `NEXT_PUBLIC_API_TOKEN`, use HTTPS, and set a narrow `CORS_ORIGINS` list. Do not expose generated tokens in logs or source control.

## Optional computer runtime

The default `fake` adapter is for local development and deterministic behavior. To enable the Docker/Playwright computer provider:

```bash
docker build -t open-dots-computer:1.62.1 ./runtime
export COMPUTER_PROVIDER=docker
export COMPUTER_DOCKER_IMAGE=open-dots-computer:1.62.1
```

The daemon must be running. Containers use a separate workspace per assistant, a read-only root filesystem, dropped capabilities, and resource limits. Computer navigation and other higher-risk operations go through the action gateway and approval flow. This is not a hardened sandbox for hostile websites; review network egress, image provenance, and credential exposure before using it with untrusted content.

For a remote computer service, configure `COMPUTER_PROVIDER=remote` and the `COMPUTER_REMOTE_*` variables in `server/app/config.py`.

## Architecture

```text
Next.js client ── HTTP + SSE ── FastAPI API
                                  ├── SQLite + encrypted settings
                                  ├── MUAPI model adapter
                                  ├── Composio connector adapter
                                  └── action gateway + approvals + audit
                                        ├── confined workspace tools
                                        └── fake / Docker / remote computer
```

The main code areas are `client/` (Next.js UI), `server/app/routers/` (HTTP API), `server/app/services/` (providers, persistence, approvals, and tools), and `runtime/` (Docker computer driver).

## Current limitations

- One local owner; user provisioning, roles, and multi-user grants are not implemented.
- SQLite is local state; coordinated multi-instance storage and backup workflows are not included.
- The model adapter is MUAPI-specific and does not provide a generic provider plugin contract.
- The computer runtime is opt-in and is not a hardened security boundary for arbitrary web content.
- Connector actions are intentionally narrow; arbitrary tool discovery and writes are not implemented.
- There is no mobile or desktop client, durable memory service, or scheduled routine engine.

## Contributing

Issues and pull requests are welcome. Keep the documentation aligned with behavior, avoid committing credentials or local transcripts, and describe API or persistence changes clearly.

## License

MIT. See [LICENSE](LICENSE).
