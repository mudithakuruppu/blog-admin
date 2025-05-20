"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import MyTiptapEditor from "../../components/MyTiptapEditor";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [categoryId, setCategoryId] = useState(1);
  const [categories, setCategories] = useState([]);

  // ✅ Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories/all");
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategoryId(res.data[0].id); 
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      title,
      excerpt,
      content,
      image,
      author,
      status,
      category: { id: categoryId },
    };

    try {
      await axios.post("http://localhost:8080/api/posts/add-post", postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Post created successfully!");
      setTitle("");
      setExcerpt("");
      setContent("");
      setImage("");
      setAuthor("");
      setStatus("DRAFT");
      setCategoryId(categories.length > 0 ? categories[0].id : 1);
    } catch (err) {
      alert("Failed to create post");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Image filename or URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Author name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label className="block font-semibold">Content</label>
        <MyTiptapEditor value={content} onChange={setContent} />

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
