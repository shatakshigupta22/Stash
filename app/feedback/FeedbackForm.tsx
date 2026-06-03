'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TYPES = [
  { value: 'general', label: 'General feedback' },
  { value: 'bug', label: 'Bug report' },
  { value: 'feature', label: 'Feature request' },
]

export default function FeedbackForm() {
  const router = useRouter()
  const [type, setType] = useState('general')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, type }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Something went wrong')
        return
      }
      setDone(true)
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-3xl mb-3">✓</div>
        <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">Thanks for the feedback!</p>
        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 mb-6">We'll take a look.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
        >
          Back to library
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setType(t.value)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              type === t.value
                ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300'
                : 'text-gray-500 dark:text-neutral-500 hover:text-gray-800 dark:hover:text-neutral-200 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          rows={5}
          required
          className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-neutral-600 text-gray-900 dark:text-neutral-100 resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !message.trim()}
          className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Sending…' : 'Send feedback'}
        </button>
      </div>
    </form>
  )
}
