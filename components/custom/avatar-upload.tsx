"use client";

import { cn } from "@/lib/utils";
import { User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { maxSize } from "zod";
import { Button } from "../ui/button";

interface AvatarUploaderProps {
  // Define any props if needed
  max_size?: number;
  className?: string;
  value: string | null | File;
  onChange: (value: string | null | File) => void;
}

const AvatarUploader = ({
  max_size = 2 * 1024 * 1024,
  className,
  value,
  onChange,
}: AvatarUploaderProps) => {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (value instanceof File) {
      const imageUrl = URL.createObjectURL(value);
      setImage(imageUrl);
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    } else if (typeof value === "string") {
      setImage(value);
    } else {
      setImage(null);
    }
    // Clear the input field when value changes (e.g, on reset)
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }, [value]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed");
      return;
    }

    if (file.size > max_size) {
      toast.error(`File size exceeds the limit of ${formatBytes(max_size)}`);
      return;
    }

    onChange(file);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    setImage(null);
    onChange(null);
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type. Only image files are allowed");
      return;
    }
    if (file.size > max_size) {
      toast.error(`File size exceeds the limit of ${formatBytes(max_size)}`);
      return;
    }

    onChange(file);
  };

  const openFileDialog = () => {
    fileInput.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={cn(
            "group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full transition-colors",
            isDragging
              ? "border-4 border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground"
          )}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {image ? (
            <img
              src={image}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Remove Button */}
        {value && (
          <Button
            size="icon"
            variant="outline"
            onClick={handleRemoveImage}
            className="size-6 absolute end-0 top-0 round-full"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="text-center space-y-0.5">
        <p className="text-sm font-medium">
          {value ? "Avatar uploaded" : "Upload avatar"}
        </p>
        <p className="text-xs text-muted-foreground">
          Png, Jpg up to {formatBytes(max_size)}
        </p>
      </div>
    </div>
  );
};

export default AvatarUploader;
