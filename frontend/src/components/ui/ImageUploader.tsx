"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { mediaService } from "@/features/media/service";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

interface Props {
  purpose?: "event-covers" | "event-gallery" | "user-avatars";
  onChange: (url: string) => void;
  currentUrl?: string;
  className?: string;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = "image/jpeg,image/png,image/webp";

export function ImageUploader({ purpose = "event-covers", onChange, currentUrl, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!ACCEPTED.split(",").includes(file.type)) {
      setError("Only JPEG, PNG and WebP images are supported.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is too large. Maximum size is 5 MB.");
      return;
    }
    setError(null);
    setStatus("uploading");
    try {
      const url = await mediaService.upload(file, purpose);
      setPreview(url);
      onChange(url);
      setStatus("idle");
    } catch {
      setError("Upload failed. Please try again.");
      setStatus("error");
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    setPreview(null);
    onChange("");
    setStatus("idle");
    setError(null);
  }

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-line bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Upload preview" className="h-48 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
            >
              Change
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleRemove}
              className="text-white hover:text-danger"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => status !== "uploading" && inputRef.current?.click()}
          className={cn(
            "flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-line bg-surface-2 transition hover:border-brand hover:bg-brand-soft/20",
            status === "uploading" && "cursor-default opacity-70",
          )}
        >
          {status === "uploading" ? (
            <>
              <Loader2 className="size-8 animate-spin text-brand" />
              <p className="text-sm text-fg-secondary">Uploading…</p>
            </>
          ) : (
            <>
              <div className="flex size-12 items-center justify-center rounded-xl bg-surface-3">
                <ImageIcon className="size-6 text-fg-muted" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-fg-secondary">
                  <span className="text-brand">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-fg-muted">JPEG, PNG, WebP · max 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={handleInputChange}
        disabled={status === "uploading"}
      />
    </div>
  );
}
