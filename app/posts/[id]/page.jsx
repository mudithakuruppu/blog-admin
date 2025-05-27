'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';
import Header from '@/components/Header'; // <-- default import here
import { NewsletterSignup } from '@/components/shared/NewsletterSignup';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/api/posts/get-post/${id}`)
        .then(res => setPost(res.data))
        .catch(err => {
          console.error('Error fetching post', err);
          setPost(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Post not found</p>
      </div>
    );
  }

  const imageUrl = post.image
    ? `http://localhost:8080/uploads/${post.image}`
    : 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div className="bg-white text-gray-800">
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title and Metadata */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
            <span>{post.author || 'Unknown Author'}</span>
            <span>•</span>
            <span>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
            {post.category?.name && (
              <>
                <span>•</span>
                <span>{post.category.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Featured Image */}
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full rounded-lg object-cover mb-8 max-h-[450px]"
        />

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Section */}
        <div className="flex justify-end mt-10 border-t pt-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Share this on:</span>
            <a href="#" className="text-gray-400 hover:text-gray-700">
              <FacebookIcon size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-700">
              <TwitterIcon size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-700">
              <InstagramIcon size={20} />
            </a>
          </div>
        </div>
      </main>

      <div className="mt-16">
        <NewsletterSignup />
      </div>
    </div>
  );
}
