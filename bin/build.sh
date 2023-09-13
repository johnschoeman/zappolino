set -e

# Setup
rm -rf build
mkdir build
cp -r public/* build

# Build
bun ./bin/esbuild.js
