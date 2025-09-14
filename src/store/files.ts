import { create } from "zustand";
import api from "@/lib/api";

export interface File {
  id: string;
  file_path: string;
  size: number;
  is_encrypted: boolean;
  status: string;
}

interface FileStore {
  files: File[];
  currentPath: string[];
  setFiles: (files: File[]) => void;
  addFile: (file: File) => void;
  removeFile: (id: string) => void;
  setCurrentPath: (path: string[]) => void;
  fetchFiles: () => Promise<void>;
}

export const useFileStore = create<FileStore>((set, get) => ({
  files: [],
  currentPath: [], // [] = root
  setFiles: (files) => set({ files }),
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
  setCurrentPath: (path) => set({ currentPath: path }),
  fetchFiles: async () => {
    const res = await api.get("/api/files");
    set({ files: res.data.files });
  },
}));
