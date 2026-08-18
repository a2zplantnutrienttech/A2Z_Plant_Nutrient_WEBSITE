"use client";

import { useRef, useState } from "react";
import indiaMap from "@svg-maps/india";
import { cn } from "@/lib/utils";

/**
 * Interactive India map.
 * - `operating`: array of { id, name, note } (ids match @svg-maps/india location ids)
 * - `activeId`: externally-controlled highlight (e.g. hovering a state chip)
 * - `onActiveChange`: notify parent when the hovered state on the map changes
 */
export default function IndiaMap({ operating = [], activeId = null, onActiveChange }) {
  const wrapRef = useRef(null);
  const [hoverId, setHoverId] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const opMap = Object.fromEntries(operating.map((s) => [s.id, s]));
  const effectiveId = hoverId || activeId;
  const tipState = hoverId ? opMap[hoverId] : null;

  const handleMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const setHover = (id) => {
    setHoverId(id);
    onActiveChange?.(id);
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full"
      onMouseMove={handleMove}
      data-testid="india-map"
    >
      <svg
        viewBox={indiaMap.viewBox}
        className="w-full h-auto max-h-[560px] overflow-visible"
        role="img"
        aria-label="Map of India showing states where A2Z Plant Nutrient operates"
      >
        {indiaMap.locations.map((loc) => {
          const isOp = Boolean(opMap[loc.id]);
          const isActive = effectiveId === loc.id;
          return (
            <path
              key={loc.id}
              d={loc.path}
              data-testid={isOp ? `map-state-${loc.id}` : undefined}
              className={cn(
                "transition-all duration-300",
                isOp ? "cursor-pointer" : "pointer-events-none"
              )}
              fill={isActive ? "#047857" : isOp ? "#34d399" : "#e7e5e4"}
              stroke={isOp ? "#065f46" : "#d6d3d1"}
              strokeWidth={isActive ? 1.4 : isOp ? 0.9 : 0.5}
              style={{
                filter: isActive ? "drop-shadow(0 6px 10px rgba(4,120,87,0.45))" : "none",
              }}
              onMouseEnter={() => isOp && setHover(loc.id)}
              onMouseLeave={() => isOp && setHover(null)}
            />
          );
        })}
      </svg>

      {tipState && (
        <div
          className="pointer-events-none absolute z-20 w-60 max-w-[70vw] rounded-2xl bg-emerald-950/95 text-white p-4 shadow-2xl border border-emerald-700/40 backdrop-blur-sm"
          style={{
            left: Math.min(pos.x + 16, (wrapRef.current?.clientWidth || 0) - 240),
            top: Math.max(pos.y - 20, 0),
          }}
          data-testid="map-tooltip"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-amber-300 font-semibold">
            Active State
          </div>
          <div className="font-serif text-lg font-semibold mt-0.5">{tipState.name}</div>
          <p className="text-[13px] leading-relaxed text-emerald-100/85 mt-1">{tipState.note}</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-5 text-xs text-stone-600">
        <span className="inline-flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-emerald-400 border border-emerald-800" />
          Operating
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-stone-200 border border-stone-300" />
          Open for projects
        </span>
      </div>
    </div>
  );
}
