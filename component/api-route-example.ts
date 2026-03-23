// Example: app/api/redlines/route.ts (Next.js App Router)
// Reads and writes .redlines.json in the project root

import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const REDLINES_PATH = join(process.cwd(), '.redlines.json')

async function getRedlines() {
  try {
    const data = await readFile(REDLINES_PATH, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveRedlines(redlines: any[]) {
  await writeFile(REDLINES_PATH, JSON.stringify(redlines, null, 2))
}

export async function GET() {
  const redlines = await getRedlines()
  const open = redlines.filter((r: any) => r.status === 'open')
  return Response.json({ data: open, count: open.length })
}

export async function POST(req: Request) {
  const body = await req.json()
  const redlines = await getRedlines()
  const newRedline = {
    id: randomUUID(),
    page_url: body.page_url,
    element_selector: body.element_selector,
    element_text: body.element_text || null,
    feedback: body.feedback,
    status: 'open',
    created_at: new Date().toISOString(),
  }
  redlines.push(newRedline)
  await saveRedlines(redlines)
  return Response.json(newRedline, { status: 201 })
}
