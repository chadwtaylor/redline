// Example: app/api/redlines/route.ts (Next.js App Router)
// Reads and writes redline/feedback.json in the project root
// Screenshots saved to redline/screenshots/

import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { execSync } from 'child_process'

// Find project root (git root) — important for monorepos where cwd is a subdirectory
function getProjectRoot(): string {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim()
  } catch {
    return process.cwd()
  }
}

const PROJECT_ROOT = getProjectRoot()
const REDLINES_DIR = join(PROJECT_ROOT, 'redline')
const REDLINES_PATH = join(REDLINES_DIR, 'feedback.json')
const SCREENSHOTS_DIR = join(REDLINES_DIR, 'screenshots')

async function getRedlines() {
  try {
    const data = await readFile(REDLINES_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveRedlines(redlines: any[]) {
  await mkdir(REDLINES_DIR, { recursive: true })
  await writeFile(REDLINES_PATH, JSON.stringify(redlines, null, 2))
}

export async function GET() {
  const redlines = await getRedlines()
  const open = redlines.filter((r: any) => r.status === 'open')
  return Response.json({ data: open, count: open.length })
}

export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') ?? ''

  // Handle multipart form data (with screenshot)
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const feedback = formData.get('feedback') as string
    const pageUrl = formData.get('page_url') as string
    const elementSelector = formData.get('element_selector') as string
    const elementText = (formData.get('element_text') as string) || null
    const screenshot = formData.get('screenshot') as File | null

    const id = randomUUID()
    let screenshotPath: string | null = null

    if (screenshot) {
      await mkdir(SCREENSHOTS_DIR, { recursive: true })
      const ext = screenshot.type === 'image/png' ? '.png' : '.jpg'
      const filename = `${id}${ext}`
      screenshotPath = `redline/screenshots/${filename}`
      const buffer = Buffer.from(await screenshot.arrayBuffer())
      await writeFile(join(SCREENSHOTS_DIR, filename), buffer)
    }

    const redlines = await getRedlines()
    const newRedline = {
      id,
      page_url: pageUrl,
      element_selector: elementSelector,
      element_text: elementText,
      feedback,
      screenshot_path: screenshotPath,
      status: 'open',
      created_at: new Date().toISOString(),
    }
    redlines.push(newRedline)
    await saveRedlines(redlines)
    return Response.json(newRedline, { status: 201 })
  }

  // Handle JSON body (no screenshot)
  const body = await req.json()
  const redlines = await getRedlines()
  const newRedline = {
    id: randomUUID(),
    page_url: body.page_url,
    element_selector: body.element_selector,
    element_text: body.element_text || null,
    feedback: body.feedback,
    screenshot_path: null,
    status: 'open',
    created_at: new Date().toISOString(),
  }
  redlines.push(newRedline)
  await saveRedlines(redlines)
  return Response.json(newRedline, { status: 201 })
}
