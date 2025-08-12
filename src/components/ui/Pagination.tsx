"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number; // how many pages to show on either side of current page
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  if (totalPages === 0) return null;

  // Helper: Generate page numbers to show, with ellipsis logic
  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 5; // prev, next, first, last, current + siblings

    if (totalPages <= totalPageNumbers) {
      // no ellipsis needed
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    const pages: (number | string)[] = [];

    pages.push(1);

    if (shouldShowLeftEllipsis) {
      pages.push("...");
    } else {
      for (let i = 2; i < leftSiblingIndex; i++) {
        pages.push(i);
      }
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    if (shouldShowRightEllipsis) {
      pages.push("...");
    } else {
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
        pages.push(i);
      }
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap justify-center items-center gap-2 py-4"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md font-medium transition-colors
          ${
            currentPage === 1
              ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
        aria-label="Previous page"
      >
        Prev
      </button>

      {pageNumbers.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="px-2 select-none text-gray-500 dark:text-gray-400"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`min-w-[2rem] px-3 py-1 rounded-md font-medium transition-colors
              ${
                page === currentPage
                  ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-900 cursor-default"
                  : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md font-medium transition-colors
          ${
            currentPage === totalPages
              ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          }`}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
