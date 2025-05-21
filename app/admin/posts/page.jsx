"use client";

import { useEffect, useState } from "react";
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

  const [editorContent, setEditorContent] = useState("");

  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder: "Write post content..." })],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  const fetchPosts = async () => {
    const token = localStorage.getItem("jwtToken");
    const res = await axios.get("http://localhost:8080/api/posts/all-posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPosts(res.data);
  };

  const fetchCategories = async () => {
    const token= localStorage.getItem("jwtToekn");
    const res = await axios.get("http://localhost:8080/api/categories/all",{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCategories(res.data);
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await axios.delete(`http://localhost:8080/api/posts/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPosts(posts.filter((post) => post.id !== id));
  };

  const openEditModal = (post) => {
    setCurrentPost(post);
    setUpdatedTitle(post.title);
    setUpdatedSlug(post.slug);
    setUpdatedCategory(post.category?.id || "");
    setEditorContent(post.content || "");
    setOpenModal(true);
    setTimeout(() => {
      editor?.commands.setContent(post.content || "");
    }, 100);
  };

  const handleUpdatePost = async () => {
    const payload = {
      ...currentPost,
      title: updatedTitle,
      slug: updatedSlug,
      categoryId: updatedCategory,
      content: editorContent,
    };

    try {
      await axios.put(`http://localhost:8080/api/posts/update-post/${currentPost.id}`, 
        payload,
      {
        headers: {
          Authorization: `Bearer ${toekn}`,
        },
      });
      fetchPosts();
      setOpenModal(false);
    } catch (err) {
      alert("Failed to update post");
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                <td className="px-4 py-2 font-bold">{post.title}</td>
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
        <Dialog as="div" className="relative z-10" onClose={() => setOpenModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" leave="ease-in duration-200"
            enterFrom="opacity-0" enterTo="opacity-100"
            leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4">
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold">Edit Post</Dialog.Title>
                  <button onClick={() => setOpenModal(false)}>
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={updatedTitle}
                    onChange={(e) => {
                      setUpdatedTitle(e.target.value);
                      setUpdatedSlug(
                        e.target.value.toLowerCase().replace(/ /g, "-")
                      );
                    }}
                    placeholder="Title"
                    className="w-full border px-3 py-2 rounded"
                  />

                  <input
                    type="text"
                    value={updatedSlug}
                    onChange={(e) => setUpdatedSlug(e.target.value)}
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
