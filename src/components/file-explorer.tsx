"use client";

import { useEffect, useMemo, useState } from "react";
import { useFileStore } from "@/store/files";
import { useExplorerStore } from "@/store/explorer";
import { Button } from "@/components/ui/button";
import {
  Download,
  Trash2,
  Share2,
  Folder,
  File as FileIcon,
  ArrowLeft,
} from "lucide-react";
import api from "@/lib/api";
import ShareModal from "./share-model";
import { toast } from "sonner";

function basename(path: string) {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? path;
}

export default function FileExplorer() {
  const files = useFileStore((s) => s.files);
  const fetchFiles = useFileStore((s) => s.fetchFiles);
  const [shareFileId, setShareFileId] = useState<string | null>(null);
  const currentPath = useExplorerStore((s) => s.currentPath);
  const setCurrentPath = useExplorerStore((s) => s.setCurrentPath);
  const goUp = useExplorerStore((s) => s.goUp);
  const searchQuery = useExplorerStore((s) => s.searchQuery);
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const { folders, filesInFolder } = useMemo(() => {
    if (!files || files.length === 0) {
      return { folders: [], filesInFolder: [] };
    }

    const normalizedCurrent = (currentPath || "")
      .replace(/^\//, "/")
      .replace(/\/$/, "");

    const uploadedFiles = files.filter((f) => f.status === "uploaded");
    if (uploadedFiles.length === 0) {
      return { folders: [], filesInFolder: [] };
    }

    const filesInFolder = uploadedFiles.filter((f) => {
      const parts = f.file_path.split("/").filter(Boolean);
      const parent = parts.slice(0, parts.length - 1).join("/");
      if (!normalizedCurrent) return parent === "";
      return parent === normalizedCurrent;
    });

    const folderSet = new Set<string>();
    uploadedFiles.forEach((f) => {
      const parts = f.file_path.split("/").filter(Boolean);
      if (!normalizedCurrent) {
        if (parts.length > 1) folderSet.add(parts[0]);
      } else {
        if (f.file_path.startsWith(normalizedCurrent + "/")) {
          const rest = f.file_path.slice(normalizedCurrent.length + 1);
          const next = rest.split("/")[0];
          if (next && rest.indexOf("/") !== -1) folderSet.add(next);
        }
      }
    });

    return { folders: Array.from(folderSet), filesInFolder };
  }, [files, currentPath]);

  const filteredFiles = useMemo(() => {
  if (!filesInFolder) return [];
  if (!searchQuery) return filesInFolder;
  return filesInFolder.filter((f) =>
    basename(f.file_path).toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [filesInFolder, searchQuery]);

  const openFolder = (name: string) => {
    const normalized = currentPath
      ? `${currentPath.replace(/\/$/, "")}/${name}`
      : name;
    setCurrentPath(normalized);
  };

  const handleDownload = async (id: string, filename?: string) => {
    try {
      const res = await api.get(`/api/files/${id}/download`, {
        responseType: "blob",
        validateStatus: () => true,
      });

      if (res.status === 200) {
        const blob = new Blob([res.data]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "file";
        a.click();
        URL.revokeObjectURL(url);
      } else if (
        res.status >= 300 &&
        res.status < 400 &&
        res.headers.location
      ) {
        window.open(res.headers.location, "_blank");
      } else {
        toast.error("Download failed");
      }
    } catch (err) {
      toast.error("Download error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/files/${id}`);
      useFileStore.getState().removeFile(id);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={goUp}
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Up
          </Button>
          <div className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            {currentPath === "" ? "Root" : currentPath}
          </div>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {folders.map((f) => (
            <div
              key={f}
              onClick={() => openFolder(f)}
              title={`Open ${f}`}
              className="p-4 bg-white rounded-xl shadow-sm cursor-pointer flex flex-col items-center justify-center hover:shadow-md hover:bg-gray-50 transition-all"
            >
              <Folder size={36} className="text-blue-500" />
              <div className="mt-2 font-medium text-sm text-center truncate w-full">
                {f}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Files */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`p-4 rounded-xl shadow-sm flex items-center justify-between border transition-all hover:shadow-md ${
                file.is_encrypted
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileIcon
                  size={20}
                  className={file.is_encrypted ? "text-red-500" : "text-gray-600"}
                />
                <div>
                  <div className="font-medium text-sm">
                    {basename(file.file_path)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleDownload(file.id, basename(file.file_path))
                  }
                >
                  <Download size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(file.id)}
                >
                  <Trash2 size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShareFileId(file.id)}
                >
                  <Share2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 text-sm py-12">
           {searchQuery ? "No matching files found." : "No files found in this folder."}
        </div>
      )}

      {shareFileId && (
        <ShareModal
          open={!!shareFileId}
          onClose={() => setShareFileId(null)}
          fileId={shareFileId}
        />
      )}
    </div>
  );
}
