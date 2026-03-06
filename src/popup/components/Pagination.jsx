import React from 'react';
import { PAGE_SIZE } from '../../utils/constants.js';

export default function Pagination({ page, total, onPageChange }) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="btn-subtle"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </button>
      <span className="pagination-info">
        Page {page + 1} of {totalPages}
        {' · '}
        <strong>{total}</strong>
        {' tasks'}
      </span>
      <button
        className="btn-subtle"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
