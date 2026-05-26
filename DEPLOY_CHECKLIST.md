# Railway Deployment Checklist

## Required Environment Variables

Set these in Railway dashboard → Project → Variables:

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (sk-ant-...) | YES |
| `APP_API_KEY` | Secret key sent by frontend as x-api-key header | YES (in prod) |
| `PORT` | Railway sets this automatically | Auto |

## Steps

1. **Push code** to GitHub (or connect repo in Railway dashboard)
2. **New Project** → Deploy from GitHub repo
3. **Variables** → Add `ANTHROPIC_API_KEY` and `APP_API_KEY`
4. **Railway auto-detects** Node.js via `package.json` and builds with Nixpacks
5. **Check logs** → should see: `AI Landing Page System v2 running on http://localhost:$PORT`
6. **Test** POST `/generate` with a valid payload

## Notes

- `demo-storage/` is ephemeral on Railway (cleared on redeploy). For persistence, use Railway Volume or external storage.
- `APP_API_KEY` can be any random string (e.g. `openssl rand -hex 32`). The server injects it into `index.html` at runtime via `window._appApiKey` — no separate frontend config needed.
- Never commit `.env` files or API keys to git.
- `ANTHROPIC_API_KEY` must NEVER be hardcoded anywhere in the codebase.
