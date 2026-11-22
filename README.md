# available.AI

An original founder workspace for business planning, website copy drafting, growth campaign templates, research briefs, approval queues, and locally saved documents.

## Run locally

```bash
npm install
npm run dev
```

## Workspace data

Workspace data is saved in the current browser using local storage. Open **Settings → Backup & Restore** to export a JSON backup or restore one in another browser. No paid database is required; data is not synced between devices.

## AI mode

The workspace runs in guided demo mode without an AI provider key. Live AI requires an `OPENAI_API_KEY` configured privately in the deployment environment and may incur provider charges. Do not commit API keys to this repository.

## Security checks

- `npm run audit:prod` checks production dependencies.
- `npm run audit:all` checks all dependencies.

