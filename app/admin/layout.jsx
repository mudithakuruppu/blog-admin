import React from 'react';
import { MdArticle } from 'react-icons/md';
import { FaTachometerAlt, FaComments, FaTags } from 'react-icons/fa';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { IoSettingsOutline } from "react-icons/io5";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4  ">

        <div className="text-2xl font-bold text-center tracking-wide ml-1 py-8 border-b-wh-500">
            MyAdmin
        </div>

        <nav className="space-y-6">

          <a href="/admin/dashboard" className="flex items-center space-x-2 hover:text-blue-400">
            <FaTachometerAlt className="w-5 h-5" />  {/* Added HomeIcon */}
            <span>Dashboard</span>
          </a>

          <a href="/admin/posts" className="flex items-center space-x-2 hover:text-blue-400">
            <MdArticle className="w-5 h-5" />
            <span>Posts</span>
          </a>

          <a href="/admin/create" className="flex items-center space-x-2 hover:text-blue-400">
            <AiOutlineFileAdd className="w-5 h-5" />
            <span>Create Post</span>
          </a>

          <a href="/admin/comments" className="flex items-center space-x-2 hover:text-blue-400">
            <FaComments className="w-5 h-5" />
            <span>Comments</span>
          </a>

          <a href="/admin/categories" className="flex items-center space-x-2 hover:text-blue-400">
            <FaTags className="w-5 h-5" />
            <span>Categories</span>
          </a>

          <a href="/admin/settings" className="flex items-center space-x-2 hover:text-blue-400">
            <IoSettingsOutline className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}

export default Layout;
