import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { chromium } from '@playwright/test'

const [, , appDirectoryArgument, outputPathArgument, portArgument] =
  process.argv

if (!appDirectoryArgument || !outputPathArgument || !portArgument) {
  throw new Error(
    'Usage: node capture-screenshot.mjs <app-directory> <output-path> <port>',
  )
}

const appDirectory = resolve(appDirectoryArgument)
const outputPath = resolve(outputPathArgument)
const port = Number.parseInt(portArgument, 10)
const url = `http://127.0.0.1:${port}`

if (!Number.isInteger(port)) {
  throw new Error(`Invalid port: ${portArgument}`)
}

const server = spawn(
  'npm',
  ['run', 'start', '--', '--hostname', '127.0.0.1', '--port', String(port)],
  {
    cwd: appDirectory,
    detached: process.platform !== 'win32',
    env: { ...process.env, CI: '1' },
    stdio: 'inherit',
  },
)

async function waitForServer() {
  const timeoutAt = Date.now() + 120_000

  while (Date.now() < timeoutAt) {
    if (server.exitCode !== null) {
      throw new Error(`Application server exited with code ${server.exitCode}`)
    }

    try {
      const response = await fetch(url)

      if (response.ok) {
        return
      }
    } catch {
      // サーバーが応答可能になるまで再試行する。
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))
  }

  throw new Error(`Application server did not become ready: ${url}`)
}

async function stopServer() {
  if (server.exitCode !== null || server.pid === undefined) {
    return
  }

  try {
    if (process.platform === 'win32') {
      server.kill('SIGTERM')
    } else {
      process.kill(-server.pid, 'SIGTERM')
    }
  } catch {
    return
  }

  await Promise.race([
    new Promise((resolveExit) => server.once('exit', resolveExit)),
    new Promise((resolveDelay) => setTimeout(resolveDelay, 5_000)),
  ])

  if (server.exitCode === null) {
    if (process.platform === 'win32') {
      server.kill('SIGKILL')
    } else {
      process.kill(-server.pid, 'SIGKILL')
    }
  }
}

let browser

try {
  await waitForServer()
  await mkdir(dirname(outputPath), { recursive: true })

  browser = await chromium.launch()
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { width: 1440, height: 900 },
  })

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.screenshot({
    animations: 'disabled',
    fullPage: true,
    path: outputPath,
  })
} finally {
  await browser?.close()
  await stopServer()
}
