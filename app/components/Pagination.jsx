'use client';

import React from 'react';

export default function Pagination({ currentPage, onPageChange, totalPages = 10 }) {
  // Function to generate page numbers with ellipsis
  function getPages(current, total) {
    const delta = 2; // Number of pages to show around current
    const range = [];
    const pages = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          pages.push(l + 1);
        } else if (i - l !== 1) {
          pages.push('ellipsis-' + i);
        }
      }
      pages.push(i);
      l = i;
    }
    return pages;
  }

  const pages = getPages(currentPage, totalPages);

  const handlePageClick = (page) => {
    if (page !== currentPage && typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        Prev
      </button>

      {pages.map((page, idx) =>
        typeof page === 'string' && page.startsWith('ellipsis-') ? (
          <span
            key={`ellipsis-${page}-${idx}`}
            className="px-3 py-2 border border-gray-300 bg-white text-gray-500 cursor-default select-none"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => handlePageClick(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={page === currentPage ? `Page ${page}, current page` : `Go to page ${page}`}
            className={`relative px-4 py-2 border text-sm font-medium transition ${
              page === currentPage
                ? 'z-10 bg-indigo-600 border-indigo-600 text-white shadow'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-indigo-50'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
