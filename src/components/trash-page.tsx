"use client";

import { useEffect, useMemo } from "react";
import { useFileStore } from "@/store/files";
import { Button } from "@/components/ui/button";
import { File as FileIcon, RotateCcw } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

function basename(path: string) {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? path;
}

export default function TrashPage() {
  const files = useFileStore((s) => s.files);
  const fetchFiles = useFileStore((s) => s.fetchFiles);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const trashFiles = useMemo(() => {
    if (!files || files.length === 0) return [];
    return files.filter((f) => f.status === "deleting");
  }, [files]);

  const handleRestore = async (id: string) => {
    try {
      const res = await api.put(`/api/files/restore/${id}`);
      if (res.status === 200) {
        toast.success("File restored successfully");
        fetchFiles();
      } else {
        toast.error("Restore failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while restoring file");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">🗑️ Trash</h2>

      {trashFiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trashFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-xl shadow-sm flex items-center justify-between border bg-red-50 border-red-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <FileIcon size={20} className="text-red-500" />
                <div>
                  <div className="font-medium text-sm">
                    {basename(file.file_path)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRestore(file.id)}
              >
                <RotateCcw size={14} className="mr-1" />
                Restore
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 text-sm py-12">
          Trash is empty.
        </div>
      )}
    </div>
  );
}
