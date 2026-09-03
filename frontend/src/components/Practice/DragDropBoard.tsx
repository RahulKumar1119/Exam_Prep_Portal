import React, { useState } from 'react';

export interface DragItem {
  id: string;
  label: string;
}

export interface DropZone {
  id: string;
  label: string;
}

interface DragDropBoardProps {
  items: DragItem[];
  zones: DropZone[];
  /** Current mapping: zoneId -> itemId */
  mapping: Record<string, string>;
  /** Called with the full updated mapping whenever the user changes an assignment */
  onChange: (mapping: Record<string, string>) => void;
  /** When true, show correct/incorrect styling and disable editing */
  checked?: boolean;
  /** Correct answer key: zoneId -> itemId (only used when checked) */
  correctMapping?: Record<string, string>;
}

/**
 * DragDropBoard — matching / drag-and-drop question UI (issue #51).
 *
 * Desktop: HTML5 drag-and-drop (drag an item chip onto a zone).
 * Touch/mobile: tap an item to select it, then tap a zone to place it
 * (tapping an occupied zone returns its item to the bank).
 *
 * No external dependency (no dnd-kit) — native DnD + a tap fallback.
 */
const DragDropBoard: React.FC<DragDropBoardProps> = ({
  items,
  zones,
  mapping,
  onChange,
  checked = false,
  correctMapping,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);

  const itemById = (id: string) => items.find((i) => i.id === id);
  const assignedItemIds = new Set(Object.values(mapping));
  const bankItems = items.filter((i) => !assignedItemIds.has(i.id));

  /** Assign an item to a zone, removing it from any zone it was previously in. */
  const assign = (zoneId: string, itemId: string) => {
    if (checked) return;
    const next: Record<string, string> = {};
    // Drop the item from any zone it currently occupies
    for (const [z, i] of Object.entries(mapping)) {
      if (i !== itemId) next[z] = i;
    }
    next[zoneId] = itemId;
    onChange(next);
    setSelectedItemId(null);
  };

  /** Remove whatever item is in a zone, returning it to the bank. */
  const clearZone = (zoneId: string) => {
    if (checked) return;
    const next = { ...mapping };
    delete next[zoneId];
    onChange(next);
  };

  // ── Tap-to-assign (touch fallback) ──────────────────────────────────────
  const onItemTap = (itemId: string) => {
    if (checked) return;
    setSelectedItemId((prev) => (prev === itemId ? null : itemId));
  };

  const onZoneTap = (zoneId: string) => {
    if (checked) return;
    if (selectedItemId) {
      assign(zoneId, selectedItemId);
    } else if (mapping[zoneId]) {
      // No item selected + zone occupied → return it to the bank
      clearZone(zoneId);
    }
  };

  // ── HTML5 drag handlers ─────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onZoneDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) assign(zoneId, itemId);
    setDragOverZone(null);
  };

  const zoneStateClass = (zoneId: string) => {
    if (checked && correctMapping) {
      return mapping[zoneId] === correctMapping[zoneId]
        ? 'border-green-500 bg-green-50'
        : 'border-red-500 bg-red-50';
    }
    if (dragOverZone === zoneId) return 'border-indigo-500 bg-indigo-50';
    return 'border-gray-300 bg-white';
  };

  return (
    <div className="space-y-4">
      {/* Items bank */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          {selectedItemId ? 'Tap a zone to place the selected item' : 'Drag or tap an item, then a zone'}
        </p>
        <div className="flex flex-wrap gap-2 min-h-12 p-2 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          {bankItems.length === 0 && (
            <span className="text-sm text-gray-400 italic px-1 py-1">All items placed</span>
          )}
          {bankItems.map((it) => (
            <button
              key={it.id}
              type="button"
              draggable={!checked}
              onDragStart={(e) => onDragStart(e, it.id)}
              onClick={() => onItemTap(it.id)}
              disabled={checked}
              className={`px-3 py-2 text-sm rounded-lg border font-medium cursor-grab active:cursor-grabbing transition-all ${
                selectedItemId === it.id
                  ? 'border-indigo-600 bg-indigo-100 text-indigo-800 ring-2 ring-indigo-300'
                  : 'border-gray-300 bg-white text-gray-800 hover:border-indigo-400'
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zones */}
      <div className="space-y-2">
        {zones.map((zone) => {
          const assignedId = mapping[zone.id];
          const assignedItem = assignedId ? itemById(assignedId) : null;
          const isCorrect = checked && correctMapping && mapping[zone.id] === correctMapping[zone.id];
          return (
            <div key={zone.id} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-32 flex-shrink-0">{zone.label}</span>
              <div
                onDragOver={(e) => {
                  if (checked) return;
                  e.preventDefault();
                  setDragOverZone(zone.id);
                }}
                onDragLeave={() => setDragOverZone((z) => (z === zone.id ? null : z))}
                onDrop={(e) => onZoneDrop(e, zone.id)}
                onClick={() => onZoneTap(zone.id)}
                className={`flex-1 min-h-12 px-3 py-2 border-2 border-dashed rounded-lg flex items-center justify-between transition-all ${zoneStateClass(
                  zone.id
                )} ${!checked ? 'cursor-pointer' : ''}`}
              >
                {assignedItem ? (
                  <>
                    <span className="text-sm font-medium text-gray-800">{assignedItem.label}</span>
                    {checked ? (
                      <span className={`text-xs font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearZone(zone.id);
                        }}
                        className="text-gray-400 hover:text-red-500 text-sm"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-gray-400 italic">Drop item here</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show the correct mapping after checking, if the user got any wrong */}
      {checked && correctMapping && (
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Correct matches</p>
          <ul className="text-sm text-gray-700 space-y-0.5">
            {zones.map((z) => (
              <li key={z.id}>
                <span className="font-medium">{z.label}</span> → {itemById(correctMapping[z.id])?.label ?? '—'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DragDropBoard;
