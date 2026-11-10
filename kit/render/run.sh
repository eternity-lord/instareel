#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
[ -d node_modules ] || npm ci
mkdir -p ../assets/fonts
cp node_modules/vazirmatn/fonts/webfonts/Vazirmatn-ExtraBold.woff2 node_modules/vazirmatn/fonts/webfonts/Vazirmatn-Medium.woff2 ../assets/fonts/
PYTHON="${PYTHON:-python3}"
[ ! -x ../../.venv/bin/python ] || PYTHON=../../.venv/bin/python
"$PYTHON" ../audio/make_audio.py
node render.mjs "$@"
