"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaFileAlt,
  FaEdit,
  FaComments,
  FaEye,
  FaTrash,
} from "react-icons/fa";

function Dashboard() {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication and fetch posts
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");  // or "token" if that’s what you use
    if (!token) {
      router.push("/admin/login");
      return;
    }

    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/posts/all-posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("jwtToken");
          router.push("/admin/login");
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
    }
  }

  fetchPosts();
}, [router]);


  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    router.push("/admin/login");
  };

  // Calculate stats from posts
  const totalPosts = posts.length;
  const drafts = posts.filter((post) => post.status === "DRAFT").length;
  const comments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);

  if (loading)
    return (
      <div className="p-8 text-center text-indigo-600 font-semibold">
        Loading dashboard...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-600 font-semibold">Error: {error}</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-8 font-sans text-gray-800">
      {/* Top Bar */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700 drop-shadow-sm">
          Dashboard
        </h1>

        <div className="flex-1 mx-8 max-w-xl">
          <input
            type="search"
            placeholder="Search posts, authors..."
            className="w-full rounded-lg border border-indigo-300 py-3 px-4 text-gray-700 placeholder-indigo-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition"
          />
        </div>

        <div className="flex items-center space-x-6 text-indigo-600">
          <FaUserCircle className="w-8 h-8 drop-shadow" />
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-md px-3 py-2 font-semibold hover:bg-indigo-100 hover:text-indigo-700 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Cards Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            icon: FaFileAlt,
            title: "Total Posts",
            value: totalPosts,
            color: "text-blue-600 bg-blue-100",
          },
          {
            icon: FaEdit,
            title: "Drafts",
            value: drafts,
            color: "text-yellow-600 bg-yellow-100",
          },
          {
            icon: FaComments,
            title: "Comments",
            value: comments,
            color: "text-green-600 bg-green-100",
          },
          {
            icon: FaEye,
            title: "Total Views",
            value: totalViews.toLocaleString(),
            color: "text-purple-600 bg-purple-100",
          },
        ].map(({ icon: Icon, title, value, color }) => (
          <div
            key={title}
            className="flex items-center rounded-xl bg-white p-5 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${color} mr-4 drop-shadow`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-xl font-extrabold text-gray-900">{value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Recent Posts Table */}
      <section className="mt-12 bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Recent Posts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800 font-semibold">
              <tr>
                <th className="py-3 px-6 rounded-tl-lg">Title</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Views</th>
                <th className="py-3 px-6 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(({ id, title, status, dateCreated, views }) => {
                const statusDisplay = status.charAt(0) + status.slice(1).toLowerCase();
                return (
                  <tr
                    key={id}
                    className="border-b border-indigo-200 hover:bg-indigo-50 transition-colors"
                  >
                    <td className="py-3 px-6 font-medium">{title}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          status === "PUBLISHED"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {statusDisplay}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {dateCreated ? new Date(dateCreated).toLocaleString() : "—"}
                    </td>
                    <td className="py-3 px-6">{views?.toLocaleString() ?? 0}</td>
                    <td className="py-3 px-6 flex space-x-4">
                      <button
                        aria-label={`Edit post ${title}`}
                        className="text-indigo-600 hover:text-indigo-900 transition"
                      >
                        <FaEdit className="w-5 h-5" />
                      </button>
                      <button
                        aria-label={`Delete post ${title}`}
                        className="text-red-600 hover:text-red-900 transition"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
