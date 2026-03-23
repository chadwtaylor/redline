'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface RedlineInspectorProps {
  active: boolean
  onDeactivate: () => void
  apiUrl?: string
}

function generateSelector(el: HTMLElement): string {
  // Prefer data-testid
  const testId = el.getAttribute('data-testid')
  if (testId) return `[data-testid="${testId}"]`

  // Try id
  if (el.id) return `#${el.id}`

  // Build a CSS path
  const parts: string[] = []
  let current: HTMLElement | null = el
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()
    if (current.id) {
      selector = `#${current.id}`
      parts.unshift(selector)
      break
    }
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).filter(c => !c.startsWith('hover:') && !c.includes(':') && c.length < 30).slice(0, 2)
      if (classes.length) selector += `.${classes.join('.')}`
    }
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName)
      if (siblings.length > 1) {
        const idx = siblings.indexOf(current) + 1
        selector += `:nth-child(${idx})`
      }
    }
    parts.unshift(selector)
    current = current.parentElement
  }
  return parts.join(' > ')
}

export function RedlineInspector({ active, onDeactivate, apiUrl = '/api/redlines' }: RedlineInspectorProps) {
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null)
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null)
  const [feedback, setFeedback] = useState('')
  const [includeScreenshot, setIncludeScreenshot] = useState(false)
  const [requestUxReview, setRequestUxReview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const screenshotCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Hover tracking
  useEffect(() => {
    if (!active || selectedEl) return

    // Skip elements that are basically full-page wrappers
    function isInteresting(el: HTMLElement): boolean {
      if (el === document.body || el === document.documentElement) return false
      if (el.closest('[data-redline-ui]')) return false
      // Skip elements that span nearly the full viewport (layout wrappers)
      const rect = el.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (rect.width > vw * 0.9 && rect.height > vh * 0.9) return false
      return true
    }

    // Walk up from the deepest element to find the most specific interesting one
    function findBestTarget(x: number, y: number): HTMLElement | null {
      const el = document.elementFromPoint(x, y) as HTMLElement | null
      if (!el) return null

      // If the direct hit is interesting, use it
      if (isInteresting(el)) return el

      // Otherwise walk up to find something interesting
      let current = el.parentElement
      while (current) {
        if (isInteresting(current)) return current
        current = current.parentElement
      }
      return null
    }

    function handleMove(e: MouseEvent) {
      const target = findBestTarget(e.clientX, e.clientY)
      setHoveredEl(target)
    }

    function handleClick(e: MouseEvent) {
      const el = e.target as HTMLElement
      if (el.closest('[data-redline-ui]')) return

      e.preventDefault()
      e.stopPropagation()

      const target = findBestTarget(e.clientX, e.clientY)
      if (target) {
        setSelectedEl(target)
        setHoveredEl(null)
      }
    }

    document.addEventListener('mousemove', handleMove, true)
    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('mousemove', handleMove, true)
      document.removeEventListener('click', handleClick, true)
    }
  }, [active, selectedEl])

  // Silently capture screenshot via html2canvas when element is selected
  useEffect(() => {
    if (!selectedEl) {
      screenshotCanvasRef.current = null
      return
    }

    async function captureElement() {
      if (!selectedEl) return
      try {
        const { domToCanvas } = await import('modern-screenshot')
        const canvas = await domToCanvas(selectedEl, {
          backgroundColor: '#1a1a1a',
          scale: 2,
        })
        screenshotCanvasRef.current = canvas
        console.log('[redline] screenshot captured:', canvas.width, 'x', canvas.height)
      } catch (err) {
        console.warn('[redline] screenshot capture failed:', err)
        screenshotCanvasRef.current = null
      }
    }

    captureElement()
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [selectedEl])

  // Escape to cancel
  useEffect(() => {
    if (!active) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (selectedEl) {
          setSelectedEl(null)
          setFeedback('')
        } else {
          onDeactivate()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [active, selectedEl, onDeactivate])

  const handleSubmit = useCallback(async () => {
    if (!selectedEl || !feedback.trim()) return
    setSubmitting(true)
    try {
      // Attach screenshot only when user opted in
      console.log('[redline] submit: includeScreenshot=', includeScreenshot, 'canvasRef=', !!screenshotCanvasRef.current)
      let screenshotBlob: Blob | null = null
      if (includeScreenshot && screenshotCanvasRef.current) {
        screenshotBlob = await new Promise<Blob | null>((resolve) => {
          screenshotCanvasRef.current!.toBlob((blob) => resolve(blob), 'image/png')
        })
      }

      if (screenshotBlob) {
        const formData = new FormData()
        formData.append('page_url', window.location.pathname)
        formData.append('element_selector', generateSelector(selectedEl))
        formData.append('element_text', selectedEl.textContent?.slice(0, 200) || '')
        formData.append('feedback', feedback.trim())
        formData.append('ux_review_requested', String(requestUxReview))
        formData.append('screenshot', screenshotBlob, 'screenshot.png')
        await fetch(apiUrl, { method: 'POST', body: formData })
      } else {
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_url: window.location.pathname,
            element_selector: generateSelector(selectedEl),
            element_text: selectedEl.textContent?.slice(0, 200) || null,
            feedback: feedback.trim(),
            ux_review_requested: requestUxReview,
          }),
        })
      }
      window.dispatchEvent(new CustomEvent('redline:submitted'))
      setSelectedEl(null)
      setFeedback('')
      onDeactivate()
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }, [selectedEl, feedback, apiUrl, onDeactivate])

  if (!active) return null

  // Compute highlight rect
  const targetEl = selectedEl || hoveredEl
  const rect = targetEl?.getBoundingClientRect()

  return (
    <>
      {/* Cursor overlay */}
      <style>{`
        ${active && !selectedEl ? '* { cursor: crosshair !important; }' : ''}
      `}</style>

      {/* Highlight overlay */}
      {rect && targetEl && (
        <div
          data-redline-ui
          ref={overlayRef}
          style={{
            position: 'fixed',
            top: rect.top - 2,
            left: rect.left - 2,
            width: rect.width + 4,
            height: rect.height + 4,
            border: selectedEl ? '2px solid #ef4444' : '2px dashed #ef4444',
            backgroundColor: selectedEl ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)',
            borderRadius: 4,
            pointerEvents: 'none',
            zIndex: 99998,
            transition: 'all 0.1s ease-out',
          }}
        />
      )}

      {/* Element label */}
      {rect && targetEl && !selectedEl && (
        <div
          data-redline-ui
          style={{
            position: 'fixed',
            top: Math.max(4, rect.top - 24),
            left: rect.left,
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: 10,
            fontFamily: 'monospace',
            padding: '2px 6px',
            borderRadius: 3,
            zIndex: 99999,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {targetEl.tagName.toLowerCase()}
          {targetEl.getAttribute('data-testid') ? `[${targetEl.getAttribute('data-testid')}]` : ''}
        </div>
      )}

      {/* Feedback modal */}
      {selectedEl && rect && (
        <div
          data-redline-ui
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedEl(null)
              setFeedback('')
            }
          }}
        >
          <div
            data-redline-ui
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 12,
              padding: 20,
              width: 400,
              maxWidth: '90vw',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>Redline Feedback</span>
              <button
                data-redline-ui
                onClick={() => { setSelectedEl(null); setFeedback('') }}
                style={{ color: '#666', fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <div style={{ fontSize: 11, color: '#888', marginBottom: 8, fontFamily: 'monospace', padding: '6px 8px', backgroundColor: '#111', borderRadius: 6, wordBreak: 'break-all' }}>
              {generateSelector(selectedEl)}
            </div>

            {selectedEl.textContent && (
              <div style={{ fontSize: 11, color: '#aaa', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                "{selectedEl.textContent.slice(0, 80)}"
              </div>
            )}

            <textarea
              ref={inputRef}
              data-redline-ui
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What's wrong? What should change?"
              onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleSubmit() }}
              style={{
                width: '100%',
                minHeight: 80,
                backgroundColor: '#111',
                border: '1px solid #333',
                borderRadius: 8,
                color: '#eee',
                fontSize: 13,
                padding: '10px 12px',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />


            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              <label
                data-redline-ui
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#aaa', cursor: 'pointer', userSelect: 'none' }}
              >
                <input
                  type="checkbox"
                  data-redline-ui
                  checked={includeScreenshot}
                  onChange={(e) => setIncludeScreenshot(e.target.checked)}
                  style={{ accentColor: '#ef4444' }}
                />
                Include Screenshot
              </label>
              <label
                data-redline-ui
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#aaa', cursor: 'pointer', userSelect: 'none' }}
              >
                <input
                  type="checkbox"
                  data-redline-ui
                  checked={requestUxReview}
                  onChange={(e) => setRequestUxReview(e.target.checked)}
                  style={{ accentColor: '#ef4444' }}
                />
                Request UX Review
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button
                data-redline-ui
                onClick={() => { setSelectedEl(null); setFeedback('') }}
                style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6, border: '1px solid #333', backgroundColor: 'transparent', color: '#aaa', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                data-redline-ui
                onClick={handleSubmit}
                disabled={submitting || !feedback.trim()}
                style={{
                  padding: '6px 14px',
                  fontSize: 12,
                  borderRadius: 6,
                  border: 'none',
                  backgroundColor: submitting || !feedback.trim() ? '#333' : '#ef4444',
                  color: submitting || !feedback.trim() ? '#666' : 'white',
                  cursor: submitting || !feedback.trim() ? 'default' : 'pointer',
                  fontWeight: 600,
                }}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            <div style={{ fontSize: 10, color: '#555', marginTop: 8, textAlign: 'right' }}>
              Cmd+Enter to submit &middot; Esc to cancel
            </div>
          </div>
        </div>
      )}
    </>
  )
}
