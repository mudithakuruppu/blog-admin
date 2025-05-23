'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const SOCIALS = [
  { name: 'Twitter', href: 'https://twitter.com', icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14.86A5.48 5.48 0 0022.4.36a11 11 0 01-3.48 1.33 5.5 5.5 0 00-9.36 5 15.62 15.62 0 01-11.36-5.7 5.5 5.5 0 001.7 7.33 5.47 5.47 0 01-2.5-.7v.07a5.5 5.5 0 004.4 5.4 5.52 5.52 0 01-2.48.1 5.5 5.5 0 005.14 3.82A11 11 0 013 19.54a15.5 15.5 0 008.44 2.47c10.13 0 15.68-8.4 15.68-15.68 0-.24 0-.48-.02-.72A11.18 11.18 0 0023 3z"/></svg>) },
  { name: 'Facebook', href: 'https://facebook.com', icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.5 9.87v-7H8v-3h2.5V9.5c0-2.5 1.5-3.87 3.77-3.87 1.1 0 2.25.2 2.25.2v2.5h-1.28c-1.26 0-1.65.78-1.65 1.57V12h2.8l-.45 3h-2.35v7A10 10 0 0022 12z"/></svg>) },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-6a6 6 0 016-6zM6 9H2v12h4zM4 3a2 2 0 110 4 2 2 0 010-4z"/></svg>) },
];

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:8080/api/categories/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setCategories(res.data);
        setFilteredCats(res.data);
      })
      .catch(err => console.error('Error fetching categories', err));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCats(categories);
    } else {
      setFilteredCats(categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  }, [searchTerm, categories]);

  return (
    <aside className="p-6 bg-white rounded-xl shadow-lg sticky top-24 max-h-[80vh] overflow-y-auto flex flex-col gap-6">
      
      {/* Search bar */}
      <div className="relative">
        <input
          type="search"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 px-4 pl-10 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Categories header with collapse toggle */}
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
        <h3 className="font-bold text-2xl text-gray-800 border-b border-gray-200 pb-2 select-none">
          Categories
        </h3>
        <button
          aria-label={collapsed ? "Expand categories" : "Collapse categories"}
          className="text-gray-600 hover:text-blue-600 transition-transform"
        >
          {collapsed ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15" /></svg>
          )}
        </button>
      </div>

      {/* Categories list */}
      {!collapsed && (
        <ul className="flex flex-col gap-3 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredCats.length === 0 && (
            <li className="text-gray-500 italic select-none">No categories found.</li>
          )}
          {filteredCats.map(cat => (
            <li
              key={cat.id}
              className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-300 flex items-center gap-3"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') alert(`Clicked on ${cat.name}`); }}
              onClick={() => alert(`Clicked on ${cat.name}`)}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
              <span className="font-medium">{cat.name}</span>
              {/* Example count, replace with actual if available */}
              <span className="ml-auto text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 select-none">12</span>
            </li>
          ))}
        </ul>
      )}

      {/* Popular Tags */}
      <div>
        <h3 className="font-bold text-2xl text-gray-800 border-b border-gray-200 pb-2 mb-3">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'JavaScript', 'CSS', 'Next.js', 'Tailwind', 'Node.js', 'API'].map(tag => (
            <button
              key={tag}
              className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
              onClick={() => alert(`Filter by tag: ${tag}`)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Social Icons */}
      <div>
        <h3 className="font-bold text-2xl text-gray-800 border-b border-gray-200 pb-2 mb-3">Follow Us</h3>
        <div className="flex gap-4">
          {SOCIALS.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>

    </aside>
  );
}
