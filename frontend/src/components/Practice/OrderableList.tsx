import React, { useState } from 'react';

interface OrderableListProps {
  /** Current ordered list of labels */
  order: string[];
  /** Move the item at `from` to index `to` */
  onReorder: (from: number, to: number) => void;
  /** When true, disable reordering and show correct/incorrect state */
  checked?: boolean;
  /** Correct order (labels) — used for per-row correctness when checked */
  correctOrder?: string[];
}

/**
 * OrderableList — build-list / ordering question UI (issue #51).
 *
 * Desktop: drag a row to reorder. Mobile/a11y: ↑/↓ buttons.
 * State/scoring are owned by the parent via onReorder(from, to).
 */
const OrderableList: React.FC<OrderableListProps> = ({ order, onReorder, checked = false, correctOrder }) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const rowState = (idx: number, label: string) => {
    if (checked && correctOrder) {
      return correctOrder[idx] === label ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50';
    }
    if (overIndex === idx && dragIndex !== null && dragIndex !== idx) return 'border-indigo-500 bg-indigo-50';
    return 'border-gray-200 bg-white';
  };

  return (
    <div className="space-y-2">
      {order.map((label, idx) => (
        <div
          key={`${label}-${idx}`}
          draggable={!checked}
          onDragStart={() => setDragIndex(idx)}
          onDragOver={(e) => {
            if (checked || dragIndex === null) return;
            e.preventDefault();
            setOverIndex(idx);
          }}
          onDrop={(e) => {
            if (checked || dragIndex === null) return;
            e.preventDefault();
            if (dragIndex !== idx) onReorder(dragIndex, idx);
            setDragIndex(null);
            setOverIndex(null);
          }}
          onDragEnd={() => {
            setDragIndex(null);
            setOverIndex(null);
          }}
          className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-all ${rowState(idx, label)} ${
            !checked ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        >
          {!checked && <span className="text-gray-400 select-none" aria-hidden>⠿</span>}
          <span className="text-sm flex-1">
            {idx + 1}. {label}
          </span>
          {checked && correctOrder && (
            <span className={`text-xs font-bold ${correctOrder[idx] === label ? 'text-green-600' : 'text-red-600'}`}>
              {correctOrder[idx] === label ? '✓' : '✗'}
            </span>
          )}
          {!checked && (
            <span className="flex gap-1">
              <button
                type="button"
                onClick={() => idx > 0 && onReorder(idx, idx - 1)}
                disabled={idx === 0}
                className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-30"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => idx < order.length - 1 && onReorder(idx, idx + 1)}
                disabled={idx === order.length - 1}
                className="px-2 py-1 text-xs bg-gray-100 rounded disabled:opacity-30"
                aria-label="Move down"
              >
                ↓
              </button>
            </span>
          )}
        </div>
      ))}
      {checked && correctOrder && order.join('|') !== correctOrder.join('|') && (
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Correct order</p>
          <ol className="text-sm text-gray-700 list-decimal list-inside space-y-0.5">
            {correctOrder.map((label, i) => (
              <li key={`${label}-${i}`}>{label}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default OrderableList;
