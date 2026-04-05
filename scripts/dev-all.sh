#!/usr/bin/env bash
set -euo pipefail

SERVER_PID=""
APP_PID=""

cleanup() {
  if [[ -n "${APP_PID}" ]] && kill -0 "${APP_PID}" 2>/dev/null; then
    kill "${APP_PID}" 2>/dev/null || true
  fi

  if [[ -n "${SERVER_PID}" ]] && kill -0 "${SERVER_PID}" 2>/dev/null; then
    kill "${SERVER_PID}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

npm run server &
SERVER_PID=$!

npm run dev &
APP_PID=$!

wait "${SERVER_PID}" "${APP_PID}"
