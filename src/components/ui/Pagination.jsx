import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// ============================================
// 📄 Reusable Pagination Component
// ============================================
// সব লিস্ট/টেবিলের জন্য এক জায়গায় পেজিনেশন

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  showInfo = true,
  maxVisiblePages = 5,
  className = '',
}) => {
  // ============================================
  // 🔢 Calculate Pages
  // ============================================
  const pageNumbers = React.useMemo(() => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // ============================================
  // 📊 Range Info
  // ============================================
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // ============================================
  // 🎯 Change Handler
  // ============================================
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  // ============================================
  // ❌ No Pagination Needed
  // ============================================
  if (totalPages <= 1 && !showInfo && !showItemsPerPage) {
    return null;
  }

  // ============================================
  // 🎨 Button Base Classes
  // ============================================
  const btnBase =
    'inline-flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed';
  const btnActive =
    'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30';
  const btnInactive =
    'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* ============================================
          Info & Items Per Page
          ============================================ */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
        {showInfo && totalItems > 0 && (
          <span>
            Showing <strong className="text-gray-800 dark:text-white">{startItem}</strong>-
            <strong className="text-gray-800 dark:text-white">{endItem}</strong> of{' '}
            <strong className="text-gray-800 dark:text-white">{totalItems}</strong>
          </span>
        )}

        {showItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) =>
                onItemsPerPageChange?.(Number(e.target.value))
              }
              className="px-2 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 dark:text-gray-200"
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ============================================
          Pagination Buttons
          ============================================ */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* First */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className={`${btnBase} ${btnInactive} hidden sm:inline-flex`}
            aria-label="First page"
            title="First page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${btnBase} ${btnInactive}`}
            aria-label="Previous page"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className={`${btnBase} ${btnInactive}`}
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-1 text-gray-400">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`${btnBase} ${
                currentPage === page ? btnActive : btnInactive
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-1 text-gray-400">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`${btnBase} ${btnInactive}`}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${btnBase} ${btnInactive}`}
            aria-label="Next page"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`${btnBase} ${btnInactive} hidden sm:inline-flex`}
            aria-label="Last page"
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;