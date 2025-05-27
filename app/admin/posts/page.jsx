"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Pencil, Trash2, Save, X, Image as ImageIcon } from "lucide-react";

export default function PostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedSlug, setUpdatedSlug] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write post content..." }),
      Image,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  const getToken = () => localStorage.getItem("jwtToken");

  const fetchPosts = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoadingPosts(true);
    try {
      const res = await axios.get("http://localhost:8080/api/posts/all-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoadingCategories(true);
    try {
      const res = await axios.get("http://localhost:8080/api/categories/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  useEffect(() => {
    if (openModal && currentPost && editor) {
      editor.commands.setContent(currentPost.content || "");
      setEditorContent(currentPost.content || "");
    }
  }, [openModal, currentPost, editor]);

  const openEditModal = (post) => {
    setCurrentPost(post);
    const title = post.title || "";
    setUpdatedTitle(title);
    setUpdatedCategory(post.category?.id || "");
    setSlugManuallyEdited(false);

    const generatedSlug = title
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    setUpdatedSlug(generatedSlug);

    setOpenModal(true);
  };

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

  const onSlugChange = (value) => {
    setUpdatedSlug(value);
    setSlugManuallyEdited(true);
  };

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

  const handleUpdatePost = async () => {
    const token = getToken();
    if (!token) {
      alert("Please log in first.");
      return;
    }

    if (!currentPost) return;

    setSavingPost(true);

    const payload = {
      ...currentPost,
      title: updatedTitle,
      slug: updatedSlug || updatedTitle
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, ""),
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
      editor.commands.clearContent();
      setUpdatedTitle("");
      setUpdatedSlug("");
      setUpdatedCategory("");
      setSlugManuallyEdited(false);
      setEditorContent("");
    } catch (err) {
      alert("Failed to update post");
      console.error(err);
    } finally {
      setSavingPost(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    (post.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Image upload handler that inserts image into editor content
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      // TODO: Replace this with your actual image upload endpoint and response handling
      /*
      const uploadRes = await axios.post(
        "http://localhost:8080/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const imageUrl = uploadRes.data.url;
      */

      // Demo: Use local blob URL (replace with real URL after upload)
      const imageUrl = URL.createObjectURL(file);

      editor.chain().focus().setImage({ src: imageUrl }).run();

      event.target.value = null; // reset input
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed");
    }
  };

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
        {loadingPosts ? (
          <div className="p-6 text-center text-gray-600">Loading posts...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="border-t">
                    <td
                      className="px-4 py-2 font-bold cursor-pointer text-blue-600 hover:underline"
                      onClick={() => openEditModal(post)}
                    >
                      {post.title}
                    </td>
                    <td className="px-4 py-2">
                      {post.category?.name || "Uncategorized"}
                    </td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-gray-500">
                    No posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            setOpenModal(false);
            setCurrentPost(null);
            editor.commands.clearContent();
            setUpdatedTitle("");
            setUpdatedSlug("");
            setUpdatedCategory("");
            setSlugManuallyEdited(false);
            setEditorContent("");
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded bg-white p-8 shadow-xl transition-all">
                  <Dialog.Title className="text-xl font-semibold flex justify-between items-center mb-6">
                    Edit Post
                    <button
                      onClick={() => {
                        setOpenModal(false);
                        setCurrentPost(null);
                        editor.commands.clearContent();
                        setUpdatedTitle("");
                        setUpdatedSlug("");
                        setUpdatedCategory("");
                        setSlugManuallyEdited(false);
                        setEditorContent("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Close modal"
                    >
                      <X size={24} />
                    </button>
                  </Dialog.Title>

                  <div className="mb-4">
                    <label className="block font-medium mb-1" htmlFor="title">
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="border w-full px-3 py-2 rounded"
                      value={updatedTitle}
                      onChange={(e) => onTitleChange(e.target.value)}
                      disabled={savingPost}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium mb-1" htmlFor="slug">
                      Slug
                    </label>
                    <input
                      id="slug"
                      type="text"
                      className="border w-full px-3 py-2 rounded"
                      value={updatedSlug}
                      onChange={(e) => onSlugChange(e.target.value)}
                      disabled={savingPost}
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block font-medium mb-1"
                      htmlFor="category"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="border w-full px-3 py-2 rounded"
                      value={updatedCategory}
                      onChange={(e) => setUpdatedCategory(e.target.value)}
                      disabled={loadingCategories || savingPost}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium mb-2">Content</label>

                    <div className="border rounded p-2 min-h-[150px]">
                      <EditorContent editor={editor} />
                    </div>

                    <label className="inline-flex items-center mt-2 cursor-pointer">
                      <ImageIcon size={16} className="mr-1" />
                      <span className="text-sm">Insert Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={savingPost}
                      />
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setOpenModal(false);
                        setCurrentPost(null);
                        editor.commands.clearContent();
                        setUpdatedTitle("");
                        setUpdatedSlug("");
                        setUpdatedCategory("");
                        setSlugManuallyEdited(false);
                        setEditorContent("");
                      }}
                      disabled={savingPost}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="inline-flex justify-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300"
                      onClick={handleUpdatePost}
                      disabled={
                        savingPost ||
                        !updatedTitle.trim() ||
                        !updatedSlug.trim() ||
                        !updatedCategory
                      }
                    >
                      {savingPost ? (
                        <>
                          <Save size={16} className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
