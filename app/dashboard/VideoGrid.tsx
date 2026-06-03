'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type Video = {
  id: string
  youtubeId: string
  title: string
  channel: string
  thumbnail: string
  category: string
  watchLater: boolean
}

export default function VideoGrid({ videos: initial }: { videos: Video[] }) {
  const router = useRouter()
  const [videos, setVideos] = useState(initial)
  const [importing, setImporting] = useState(false)
  const [recategorizing, setRecategorizing] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showWatchLater, setShowWatchLater] = useState(false)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'az'>('newest')

  const categories = useMemo(() => {
    const set = new Set(videos.map((v) => v.category))
    return ['All', ...Array.from(set).sort()]
  }, [videos])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const result = videos.filter((v) => {
      if (showWatchLater && !v.watchLater) return false
      if (activeCategory !== 'All' && v.category !== activeCategory) return false
      if (q && !v.title.toLowerCase().includes(q) && !v.channel.toLowerCase().includes(q)) return false
      return true
    })
    if (sortOrder === 'az') result.sort((a, b) => a.title.localeCompare(b.title))
    else if (sortOrder === 'oldest') result.reverse()
    return result
  }, [videos, search, activeCategory, showWatchLater, sortOrder])

  async function handleRecategorize() {
    setRecategorizing(true)
    setImportError(null)
    try {
      const res = await fetch('/api/recategorize', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setImportError(data.error ?? 'Recategorization failed'); return }
      if (data.categorizationError) setImportError(`AI error: ${data.categorizationError}`)
      router.refresh()
    } catch { setImportError('Network error') }
    finally { setRecategorizing(false) }
  }

  async function handleImport() {
    setImporting(true)
    setImportError(null)
    try {
      const res = await fetch('/api/import-videos', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { setImportError(data.error ?? 'Import failed'); return }
      if (data.categorizationError) setImportError(`AI categorization failed: ${data.categorizationError}`)
      router.refresh()
    } catch { setImportError('Network error') }
    finally { setImporting(false) }
  }

  async function toggleWatchLater(video: Video) {
    setVideos((prev) => prev.map((v) => v.id === video.id ? { ...v, watchLater: !v.watchLater } : v))
    try {
      const res = await fetch(`/api/videos/${video.id}/watch-later`, { method: 'PATCH' })
      if (!res.ok) setVideos((prev) => prev.map((v) => v.id === video.id ? { ...v, watchLater: video.watchLater } : v))
    } catch {
      setVideos((prev) => prev.map((v) => v.id === video.id ? { ...v, watchLater: video.watchLater } : v))
    }
  }

  const busy = importing || recategorizing
  const watchLaterCount = videos.filter((v) => v.watchLater).length

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={handleImport}
            disabled={busy}
            className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {importing ? 'Importing…' : 'Import'}
          </button>
          {videos.length > 0 && (
            <button
              onClick={handleRecategorize}
              disabled={busy}
              className="px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {recategorizing ? 'Categorizing…' : 'Re-categorize'}
            </button>
          )}
          {busy && (
            <span className="text-xs text-violet-400 animate-pulse">AI is thinking…</span>
          )}
        </div>

        {videos.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'az')}
              className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors text-gray-600 dark:text-neutral-400"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
            </select>
            <input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 px-3 py-1.5 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 transition-colors placeholder:text-gray-400 dark:placeholder:text-neutral-600 text-gray-900 dark:text-neutral-100"
            />
          </div>
        )}
      </div>

      {importError && (
        <p className="text-xs text-red-400 mb-4 px-1">{importError}</p>
      )}

      {/* Filters */}
      {videos.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 mb-7">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowWatchLater(false) }}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                activeCategory === cat && !showWatchLater
                  ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300'
                  : 'text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
          {watchLaterCount > 0 && (
            <>
              <div className="w-px h-3.5 bg-gray-200 dark:bg-neutral-700 mx-0.5" />
              <button
                onClick={() => { setShowWatchLater((s) => !s); setActiveCategory('All') }}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  showWatchLater
                    ? 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300'
                    : 'text-gray-500 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                Watch later · {watchLaterCount}
              </button>
            </>
          )}
        </div>
      )}

      {/* Grid */}
      {videos.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-4xl mb-4">▷</div>
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">Your library is empty</p>
          <p className="text-xs text-gray-400 dark:text-neutral-600 mt-1">Import your liked YouTube videos to get started</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-gray-400 dark:text-neutral-500">No videos match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((video) => (
            <div
              key={video.id}
              className="group rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-neutral-950 hover:border-gray-200 dark:hover:border-neutral-700 transition-all duration-200"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover bg-gray-100 dark:bg-neutral-800"
                />
                {/* Play overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">▷</span>
                </div>
              </a>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-neutral-100 line-clamp-2 leading-snug">
                  {video.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 truncate">{video.channel}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-xs text-gray-400 dark:text-neutral-600">{video.category}</span>
                  <button
                    onClick={() => toggleWatchLater(video)}
                    title={video.watchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}
                    className={`text-xs font-medium transition-all px-2 py-0.5 rounded-md ${
                      video.watchLater
                        ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950'
                        : 'text-gray-300 dark:text-neutral-700 hover:text-violet-500 dark:hover:text-violet-400'
                    }`}
                  >
                    {video.watchLater ? 'saved' : '+ later'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
