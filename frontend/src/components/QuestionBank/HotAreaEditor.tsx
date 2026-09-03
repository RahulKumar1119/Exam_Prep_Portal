import React from 'react';

export interface HotArea {
  id: string;
  coords: number[]; // [x%, y%, w%, h%]
  shape?: string;
}

interface HotAreaEditorProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  areas: HotArea[];
  onAreasChange: (areas: HotArea[]) => void;
  correctArea: string;
  onCorrectAreaChange: (id: string) => void;
  error?: string;
}

/**
 * HotAreaEditor — author a "click the correct region" question (issue #51).
 *
 * The admin provides an image URL (host anywhere, e.g. the courses007 bucket)
 * and defines clickable regions by percentage coordinates. A live preview
 * overlays the regions on the image so placement can be verified without an
 * image-upload pipeline.
 */
const HotAreaEditor: React.FC<HotAreaEditorProps> = ({
  imageUrl,
  onImageUrlChange,
  areas,
  onAreasChange,
  correctArea,
  onCorrectAreaChange,
  error,
}) => {
  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  const updateArea = (idx: number, patch: Partial<HotArea>) => {
    const next = areas.map((a, i) => (i === idx ? { ...a, ...patch } : a));
    onAreasChange(next);
  };

  const updateCoord = (idx: number, ci: number, value: number) => {
    const next = areas.map((a, i) => {
      if (i !== idx) return a;
      const coords = [...(a.coords.length === 4 ? a.coords : [0, 0, 20, 10])];
      coords[ci] = Math.max(0, Math.min(100, value || 0));
      return { ...a, coords };
    });
    onAreasChange(next);
  };

  const addArea = () => {
    const nextId = `area${areas.length + 1}`;
    onAreasChange([...areas, { id: nextId, coords: [10, 10, 20, 10] }]);
  };

  const removeArea = (idx: number) => {
    const removed = areas[idx];
    onAreasChange(areas.filter((_, i) => i !== idx));
    if (removed && removed.id === correctArea) onCorrectAreaChange('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-900">Hot Area *</label>

      {/* Image URL */}
      <input
        type="url"
        value={imageUrl}
        onChange={(e) => onImageUrlChange(e.target.value)}
        className={inputClass}
        placeholder="Image URL (https://…/diagram.png)"
      />

      {/* Live preview with region overlays */}
      {imageUrl && (
        <div className="relative border rounded overflow-hidden bg-gray-50 inline-block max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Hot area preview" className="max-w-full h-auto block" />
          {areas.map((a) => {
            const [x, y, w, h] = a.coords.length === 4 ? a.coords : [0, 0, 0, 0];
            const isCorrect = a.id === correctArea;
            return (
              <div
                key={a.id}
                className={`absolute border-2 flex items-center justify-center text-[10px] font-bold ${
                  isCorrect ? 'border-green-500 bg-green-300/40 text-green-900' : 'border-indigo-500 bg-indigo-300/30 text-indigo-900'
                }`}
                style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
              >
                {a.id}
              </div>
            );
          })}
        </div>
      )}

      {/* Region rows */}
      <div className="space-y-2">
        {areas.map((a, idx) => (
          <div key={idx} className="flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded-lg">
            <input
              type="radio"
              name="correct_area"
              checked={a.id === correctArea}
              onChange={() => onCorrectAreaChange(a.id)}
              className="w-4 h-4 text-green-600"
              aria-label={`Mark ${a.id} correct`}
            />
            <input
              type="text"
              value={a.id}
              onChange={(e) => updateArea(idx, { id: e.target.value })}
              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="id"
            />
            {['x%', 'y%', 'w%', 'h%'].map((lbl, ci) => (
              <label key={lbl} className="flex items-center gap-1 text-xs text-gray-600">
                {lbl}
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={a.coords[ci] ?? 0}
                  onChange={(e) => updateCoord(idx, ci, parseFloat(e.target.value))}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => removeArea(idx)}
              className="text-gray-400 hover:text-red-500 text-sm ml-auto"
              aria-label="Remove region"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={addArea} className="text-sm text-blue-600 hover:underline">
        + Add region
      </button>
      <p className="text-xs text-gray-500">
        Coordinates are percentages of the image (x, y = top-left corner; w, h = size). Select the radio for the correct region.
      </p>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default HotAreaEditor;
