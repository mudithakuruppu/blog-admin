'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

const PAGE_SIZE = 8

export default function PostList({ posts, categories }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const { theme, setTheme } = useTheme()

  const filtered = useMemo(() => {
    return posts.filter(
      (p) =>
        (!categoryFilter || p.category?.id === +categoryFilter) &&
        p.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [posts, search, categoryFilter])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  useEffect(() => {
    setPage(1)
  }, [search, categoryFilter])

  return (
    <section className="px-4 py-12 mx-auto max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-black-100">All Posts</h1>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {paged.map((post, idx) => {
          const imageUrl = post.image
            ? `http://localhost:8080/uploads/${post.image}`
            : 'https://via.placeholder.com/400x250?text=No+Image'

          return (
            <article
              key={post.id}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
            >
              {idx < 2 && page === 1 && (
                <span className="absolute top-3 left-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                  Featured
                </span>
              )}

              <Link href={`/posts/${post.id}`}>
                <div className="overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="p-5 flex flex-col h-[220px] justify-between">
                <Link href={`/posts/${post.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:underline line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/posts/${post.id}`}
                  className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-200 transition"
                >
                  Read More →
                </Link>
              </div>
            </article>
          )
        })}
      </div>

      <div className="mt-10 flex justify-center space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-2 border rounded ${page === i + 1 ? 'bg-indigo-600 text-white' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  )
}
