"use client";

import { useState } from "react";
import api from "@/lib/api";
import axios from "axios";
import { useExplorerStore } from "@/store/explorer";
import { useFileStore } from "@/store/files";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [overridePath, setOverridePath] = useState<string>("");
  const [isEncrypted, setIsEncrypted] = useState(false);
  const currentPath = useExplorerStore((s) => s.currentPath);
  const fetchFiles = useFileStore((s) => s.fetchFiles);

  if (!open) return null;

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const finalizeUpload = async (fileId: string) => {
    try {
      await api.post(`/api/files/${fileId}/finalize`);
    } catch (err) {
      console.error(err)
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    try {
      const folder = (overridePath || currentPath || "/").replace(/^\//, "").replace(/\/$/, "");
      const filename = file.name;
      const filePath = folder ? `${folder}/${filename}` : filename;

      if (isEncrypted) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("file_path", filePath);

        await api.post("/api/files/encrypted", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await fetchFiles();
        onClose();
        return;
      }

      const resp = await api.post("/api/files/presigned", {
        file_path: filePath,
        size: file.size,
      });
      const uploadUrl = resp.data.upload_url;
      const fileId = resp.data.file_id;

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      });

      finalizeUpload(fileId);
      await fetchFiles();
      onClose();
    } catch (err) {
      console.error("upload error", err);
      toast.error("Upload failed")
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-[540px]">
        <h3 className="text-lg font-semibold mb-4">Upload file</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600">File</label>
            <input type="file" onChange={handleSelect} />
            <div className="text-sm text-gray-500 mt-1">{file?.name}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-600">Upload to</label>
            <input
              type="text"
              value={currentPath}
              onChange={(e) => setOverridePath(e.target.value)}
              placeholder="/ or folder/subfolder"
              className="w-full p-2 border rounded mt-1"
            />
            <div className="text-xs text-gray-400 mt-1">
              Default is current folder. You can override the path.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="enc"
              type="checkbox"
              checked={isEncrypted}
              onChange={() => setIsEncrypted((s) => !s)}
            />
            <label htmlFor="enc" className="text-sm">
              Encrypt on server (AES-GCM)
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpload}>Upload</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
