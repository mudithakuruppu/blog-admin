"use client";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/posts/get-post/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("Error fetching post", err));
  }, [id]);

  if (!post) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 mb-2">
        Category: {post.category?.name || "Uncategorized"}
      </p>
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full rounded mb-6" />
      )}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
