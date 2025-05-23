"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Pencil, Trash2, Save, X } from "lucide-react";

export default function PostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedSlug, setUpdatedSlug] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Flag to detect if slug was manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Editor setup
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "Write post content..." })],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  const [editorContent, setEditorContent] = useState("");

  // Utility: fetch token fresh each time, in case it changes
  const getToken = () => localStorage.getItem("jwtToken");

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8080/api/posts/all-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8080/api/categories/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  // When modal opens and currentPost changes, set editor content
  useEffect(() => {
    if (openModal && currentPost && editor) {
      editor.commands.setContent(currentPost.content || "");
      setEditorContent(currentPost.content || "");
    }
  }, [openModal, currentPost, editor]);

  // Handle opening the modal for editing
  const openEditModal = (post) => {
    setCurrentPost(post);

    const title = post.title || "";
    setUpdatedTitle(title);
    setUpdatedCategory(post.category?.id || "");
    setSlugManuallyEdited(false);

    // Generate slug from title initially
    const generatedSlug = title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    setUpdatedSlug(generatedSlug);

    setOpenModal(true);
  };

  // Update slug when title changes only if slug wasn't manually edited
  const onTitleChange = (value) => {
    setUpdatedTitle(value);

    if (!slugManuallyEdited) {
      const generatedSlug = value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
      setUpdatedSlug(generatedSlug);
    }
  };

  // Mark slug as manually edited when user types in slug input
  const onSlugChange = (value) => {
    setUpdatedSlug(value);
    setSlugManuallyEdited(true);
  };

  // View post handler
  const handleViewPost = async (post) => {
    const token = getToken();
    if (!token) {
      alert("Please log in first.");
      return;
    }

    try {
      await axios.get(`http://localhost:8080/api/posts/get-post/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post viewed successfully!");
    } catch (error) {
      console.error("Error viewing post:", error.response || error.message);
      if (error.response?.status === 403) {
        alert("You are not authorized to view this post.");
      } else {
        alert("An error occurred.");
      }
    }
  };

  // Delete post handler
  const handleDelete = async (id) => {
    const token = getToken();
    if (!token) {
      alert("Please log in first.");
      return;
    }
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/posts/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      alert("Failed to delete post");
      console.error(error);
    }
  };

  // Update post handler
  const handleUpdatePost = async () => {
    const token = getToken();
    if (!token) {
      alert("Please log in first.");
      return;
    }

    if (!currentPost) return;

    const payload = {
      ...currentPost,
      title: updatedTitle,
      slug: updatedSlug,
      categoryId: updatedCategory,
      content: editorContent,
    };

    try {
      await axios.put(
        `http://localhost:8080/api/posts/update-post/${currentPost.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPosts();
      setOpenModal(false);
      setCurrentPost(null);
    } catch (err) {
      alert("Failed to update post");
      console.error(err);
    }
  };

  // Filter posts based on search term
  const filteredPosts = posts.filter((post) =>
    (post.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">📝 Manage Posts</h1>

      <input
        type="text"
        placeholder="Search by title..."
        className="border px-3 py-2 rounded w-full mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Category</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-t">
                <td
                  className="px-4 py-2 font-bold cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleViewPost(post)}
                >
                  {post.title}
                </td>
                <td className="px-4 py-2">{post.category?.name || "Uncategorized"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEditModal(post)}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpenModal(false)}
          static
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            leave="ease-in duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold">Edit Post</Dialog.Title>
                  <button onClick={() => setOpenModal(false)} aria-label="Close modal">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={updatedTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Title"
                    className="w-full border px-3 py-2 rounded"
                  />

                  <input
                    type="text"
                    value={updatedSlug}
                    onChange={(e) => onSlugChange(e.target.value)}
                    placeholder="Slug"
                    className="w-full border px-3 py-2 rounded"
                  />

                  <select
                    value={updatedCategory}
                    onChange={(e) => setUpdatedCategory(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <div className="border rounded p-2">
                    <EditorContent editor={editor} />
                  </div>

                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setOpenModal(false)}
                      className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdatePost}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Save size={16} /> Save
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
