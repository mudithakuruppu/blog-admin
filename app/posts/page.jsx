// app/posts/page.jsx
import PostList from '../components/PostList'

export const metadata = {
  title: 'All Posts',
  description: 'Browse all blog posts with filters, search, and pagination',
}

async function fetchPosts() {
  const res = await fetch('http://localhost:8080/api/posts/all-posts', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

async function fetchCategories() {
  const res = await fetch('http://localhost:8080/api/categories/all', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export default async function PostsPage() {
  const [posts, categories] = await Promise.all([fetchPosts(), fetchCategories()])

  return <PostList posts={posts} categories={categories} />
}
