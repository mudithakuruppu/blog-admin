'use client';

import { useEffect, useState } from 'react';
import { getPosts, getCategories } from '@/lib/api';

import HeroSection from '@/components/HeroSection';
import FeaturedPosts from '@/components/FeaturedPosts';
import LatestPosts from '@/components/LatestPosts';
import Sidebar from '@/components/Sidebar';
import Pagination from '@/components/Pagination';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const postsData = await getPosts(currentPage);
      const categoriesData = await getCategories();
      setPosts(postsData);
      setCategories(categoriesData);
    }

    fetchData();
  }, [currentPage]);

  return (
    <main className=" bg-gradient-to-b from-white to-gray-100 min-h-screen w-full font-sans text-gray-900">
      {/* Hero Section with nice padding and shadow */}
      <HeroSection />

      {/* Featured Posts - Full Width, with subtle shadow and rounded corners */}
      <section className="max-w-[1440px] mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800">Featured Posts</h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <FeaturedPosts posts={posts} />
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="max-w-[1440px] mx-auto px-6 py-10 flex flex-col lg:flex-row gap-12">
        {/* Posts List + Pagination */}
        <div className="flex-1 space-y-10">
          <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-3">Latest Posts</h3>
          <LatestPosts posts={posts} />

          <div className="flex justify-center mt-8">
            <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 sticky top-24 self-start bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Categories</h3>
          <Sidebar categories={categories} />
        </aside>
      </section>
    </main>
  );
}
