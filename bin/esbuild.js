const { solidPlugin } = require("esbuild-plugin-solid")
const esbuild = require("esbuild")

esbuild
  .build({
    entryPoints: ["./src/index.js"],
    bundle: true,
    outdir: "./build/static/js",
    sourcemap: process.argv.includes("--sourcemap"),
    minify: process.argv.includes("--minify"),
    plugins: [solidPlugin()],
  })
  .catch(() => process.exit(1))
