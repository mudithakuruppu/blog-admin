"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Pencil } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch categories
  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8080/api/categories/all");
    const data = await res.json();
    setCategories(data);
    setFilteredCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle search filter
  useEffect(() => {
    const filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.slug.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [search, categories]);

  // Submit form (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/api/categories/update`
      : "http://localhost:8080/api/categories/add";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: editingId}),
    });

    if (res.ok) {
      setForm({ name: "", slug: "" });
      setEditingId(null);
      fetchCategories();
    } else {
      alert("Error saving category.");
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name, slug: category.slug });
    setEditingId(category.id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      await fetch(`http://localhost:8080/api/categories/delete/${id}`, {
        method: "DELETE",
      });
      fetchCategories();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📂 Category Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            required
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug (e.g., software)"
            required
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={18} />
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3">{cat.slug}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    >
                      <Pencil size={16} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
