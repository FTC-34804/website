"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

type GalleryImage = {
  filename: string;
  url: string;
  uploadedAt: number;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

const ROW_UNIT = 8; // px, granularity of the masonry row grid
const ROW_GAP = 12; // px, must match the grid gap

// Deterministic hash so each image keeps a stable "prominence" between renders.
function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Mix sizes like a social feed: most images are 1 column, some are wider.
function columnSpan(filename: string): number {
  const bucket = hash(filename) % 10;
  if (bucket < 6) return 1; // 60% normal
  if (bucket < 9) return 2; // 30% wide
  return 3; // 10% extra wide
}

function MasonryItem({ image }: { image: GalleryImage }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [rowSpan, setRowSpan] = useState(1);

  const measure = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const height = img.getBoundingClientRect().height;
    if (height === 0) return;
    setRowSpan(Math.max(1, Math.ceil((height + ROW_GAP) / (ROW_UNIT + ROW_GAP))));
  }, []);

  // Re-measure whenever the item is resized (column-width / viewport changes).
  useLayoutEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div
      ref={itemRef}
      style={{
        gridColumn: `span ${columnSpan(image.filename)}`,
        gridRowEnd: `span ${rowSpan}`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={image.url}
        alt={image.filename}
        loading="lazy"
        onLoad={measure}
        className="block w-full rounded-md"
      />
    </div>
  );
}

export function GalleryView() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const size = 260;

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/gallery", { cache: "no-store" });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data.error === "string" && data.error) ||
          "Failed to load images.";
        setState({ kind: "error", message });
        return;
      }

      setImages(Array.isArray(data?.images) ? data.images : []);
      setState({ kind: "ready" });
    } catch {
      setState({ kind: "error", message: "Network error while loading images." });
    }
  }, []);

  useEffect(() => {
    // load() only mutates state asynchronously inside the fetch promise.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Refresh when the upload dialog reports new uploads.
  useEffect(() => {
    function onUploaded() {
      load();
    }
    window.addEventListener("gallery:uploaded", onUploaded);
    return () => window.removeEventListener("gallery:uploaded", onUploaded);
  }, [load]);

  return (
    <div className="m-2 flex flex-col gap-3">
      <div className="h-[70vh] overflow-y-auto rounded-md border border-gray-300 p-3">
        {state.kind === "loading" ? (
          <p className="text-sm text-gray-600">loading…</p>
        ) : state.kind === "error" ? (
          <p className="text-sm text-red-700">{state.message}</p>
        ) : images.length === 0 ? (
          <></>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`,
              gridAutoRows: `${ROW_UNIT}px`,
              gridAutoFlow: "row dense",
              gap: `${ROW_GAP}px`,
            }}
          >
            {images.map((image) => (
              <MasonryItem key={image.filename} image={image} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
