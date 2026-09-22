"use client";

import { useEffect, useRef, useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "uploading" }
  | { kind: "success"; count: number }
  | { kind: "error"; message: string };

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Open the dialog when the user presses "i" on the gallery page.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "i" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTyping) return;

      event.preventDefault();
      setOpen(true);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Sync the native <dialog> element with React state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function close() {
    setOpen(false);
    setFiles([]);
    setStatus({ kind: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  function onSelectFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files ? Array.from(event.target.files) : [];
    setFiles(selected);
    setStatus({ kind: "idle" });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (files.length === 0) {
      setStatus({ kind: "error", message: "Select at least one image." });
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append("images", file);
    }

    setStatus({ kind: "uploading" });

    try {
      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && typeof data.error === "string" && data.error) ||
          "Upload failed. Please try again.";
        setStatus({ kind: "error", message });
        return;
      }

      const count = Array.isArray(data?.uploaded) ? data.uploaded.length : files.length;
      setStatus({ kind: "success", count });
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      window.dispatchEvent(new CustomEvent("gallery:uploaded"));
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onCancel={close}
      className="m-auto rounded-md p-0 backdrop:bg-black/50"
    >
      <form
        onSubmit={onSubmit}
        className="flex w-[22rem] max-w-[90vw] flex-col gap-4 bg-gray-200 p-6 font-mono text-foreground"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">upload images</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="px-2 text-lg leading-none hover:font-bold"
          >
            x
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          multiple
          onChange={onSelectFiles}
          className="text-sm"
        />

        {files.length > 0 ? (
          <ul className="max-h-32 overflow-auto text-sm">
            {files.map((file) => (
              <li key={`${file.name}-${file.size}`} className="truncate">
                {file.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">no files selected</p>
        )}

        {status.kind === "error" ? (
          <p className="text-sm text-red-700">{status.message}</p>
        ) : null}
        {status.kind === "success" ? (
          <p className="text-sm text-green-700">
            uploaded {status.count} image{status.count === 1 ? "" : "s"}.
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-md bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
          >
            cancel
          </button>
          <button
            type="submit"
            disabled={status.kind === "uploading"}
            className="rounded-md bg-gray-800 px-3 py-1 text-sm text-white hover:bg-black disabled:opacity-50"
          >
            {status.kind === "uploading" ? "uploading…" : "upload"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
