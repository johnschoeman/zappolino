set -e

# Setup
rm -rf build
mkdir build
cp -r public/* build

# Build
bun build ./src/index.js --outdir ./build/static/js
