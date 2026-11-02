#!/usr/bin/env bash
# Starts the Spring Boot API on :8080 and the Vite dev server for the frontend.
set -e
cd "$(dirname "$0")"

mvn -q spring-boot:run &
BACKEND_PID=$!
trap 'kill "$BACKEND_PID" 2>/dev/null || true' EXIT

cd frontend
[ -d node_modules ] || npm ci
npm run dev
