#!/usr/bin/env bash
# Baixa o CLI standalone do Tailwind v4 para Linux x64 em ./bin/tailwindcss
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/bin/tailwindcss"
URL="https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64"
curl -fsSL "$URL" -o "$DEST"
chmod +x "$DEST"
"$DEST" --help | head -3
echo "OK: $DEST"
