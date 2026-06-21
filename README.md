# Playo US — Badminton Activity Hosting App

A platform for the US badminton community to host and join pickup games.

## Packages
- `packages/backend` — NestJS REST API + WebSocket chat
- `packages/web` — Next.js web app
- `packages/mobile` — Expo React Native mobile app
- `packages/shared` — Shared TypeScript types

## Quick Start
cp packages/backend/.env.example packages/backend/.env
# fill in DB credentials, then:
npm install
npm run dev:backend
npm run dev:web
