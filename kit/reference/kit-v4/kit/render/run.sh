#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
[ -d node_modules ] || npm i
mkdir -p ../assets/fonts
cp -n node_modules/vazirmatn/fonts/webfonts/Vazirmatn-ExtraBold.woff2 node_modules/vazirmatn/fonts/webfonts/Vazirmatn-Medium.woff2 ../assets/fonts/ 2>/dev/null || true
(cd .. && python3 audio/make_audio.py) || echo "audio step skipped"
rm -rf ../out/frames
node render.mjs "$@"
