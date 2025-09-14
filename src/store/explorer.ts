// src/store/explorer.ts
import { create } from "zustand";

function normalizePath(p: string) {
  if (!p) return "";
  // remove leading/trailing slashes
  const s = p.replace(/^\/+/, "").replace(/\/+$/, "");
  return s;
}

interface ExplorerState {
  currentPath: string; // normalized, "" = root, "Projects/AI" = folder
  setCurrentPath: (path: string) => void;
  goUp: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  currentPath: "",
  setCurrentPath: (path: string) => set({ currentPath: normalizePath(path) }),
  goUp: () => {
    const cur = get().currentPath;
    if (!cur) return set({ currentPath: "" });
    const parts = cur.split("/").filter(Boolean);
    parts.pop();
    set({ currentPath: parts.join("/") });
  },
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
