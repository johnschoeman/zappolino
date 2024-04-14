set -e

# Setup
rm -rf build
mkdir build
cp -r public/* build

# Build

## JavaScript
echo "Building JavaScript"
bun ./bin/esbuild.js

## CSS
echo "Building CSS"
./bin/build_css.sh
