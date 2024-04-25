import chokidar from "chokidar"
import util from "util"
import browserSync from "browser-sync"
import chalk from "chalk"
import cp from "child_process"

const bs = browserSync.create()

const exec = util.promisify(cp.exec)

const logPrefix = "[" + chalk.blue("Developsync") + "]"
const log = console.log.bind(console, logPrefix)

const SOURCE_DIR = "./src"
const dotFilesRegex = /(^|[\/\\])\../

const watcher = chokidar.watch(SOURCE_DIR, {
  ignored: dotFilesRegex,
  persistent: true,
})

const startDevServer = async log => {
  log("Starting Dev Server...")

  // Watch and Build
  const buildApp = async () => {
    log("Building app...")
    try {
      const { stdout, stderr } = await exec("bin/build.sh")
      log(stdout)
      if (stderr && stderr.length > 0) {
        log(stderr)
      }
    } catch (error) {
      const { stderr } = error
      log(stderr)
    }
  }

  await buildApp()

  const allEvents = "all"
  watcher.on(allEvents, async (event, path) => {
    log(event, path)
    await buildApp()
  })

  // BrowserSync
  bs.watch("./build/static/js/*.js").on("change", () => {
    log("Reloading js...")
    bs.reload()
  })

  bs.watch("./build/static/css/*.css").on("change", () => {
    log("Reloading css...")
    bs.reload()
  })

  bs.init({
    open: false,
    server: "./build",
    snippet: true,
  })
}

startDevServer(log)
