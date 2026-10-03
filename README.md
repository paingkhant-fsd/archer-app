# Archer App

The web client for Archer. It provides public project discovery, project details, and authentication against `archer-api`.

## Prerequisites

- Node.js 24+
- npm 11+
- `archer-api` running locally for live project data and login

## Setup

From this directory:

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The API defaults to `http://localhost:4000/api/v1`. To use another API URL, create `.env.local`:

```text
VITE_API_URL=http://localhost:4000/api/v1
```

## Current user flows

- Browse published projects.
- Search projects by title, description, and skills.
- Filter by category and currency.
- Open project details.
- Sign in with an Archer account.

Use the seeded API account for local login:

```text
Email: freelancer1@archer.local
Password: ArcherDemo123!
```

## Commands

- `npm run dev` - Start the Vite development server.
- `npm run build` - Typecheck and build for production.
- `npm run typecheck` - Run the TypeScript check.
- `npm run lint` - Run Oxlint.

## Project structure

- `src/App.tsx` - Routes and page UI.
- `src/api.ts` - Typed API requests and response mapping.
- `src/App.css` - Archer visual styles.
- `components.json` - shadcn/ui configuration using preset `beEhfqy2`.

## Troubleshooting

If the page shows `API unavailable`, start the API in a second terminal:

```powershell
cd ..\archer-api
npm run dev
```

If port `5173` is busy, Vite selects another port and prints the correct URL.
