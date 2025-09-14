"use client";

import { Button } from "@/components/ui/button";
import { Upload, Search, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UploadModal from "./upload-model";
import { useExplorerStore } from "@/store/explorer";

const TopNav = () => {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const setSearchQuery = useExplorerStore((s) => s.setSearchQuery);


  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <div className="h-14 flex items-center justify-between px-4 bg-white border-b">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg w-1/2">
          <Search size={16} className="text-gray-500" />
         <input
            type="text"
            placeholder="Search files..."
            className="bg-transparent outline-none w-full text-sm"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Upload + User + Logout */}
        <div className="flex items-center gap-4">
          <Button className="flex gap-2" onClick={() => setOpen(true)}>
            <Upload size={16} /> Upload
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex gap-2 text-red-500 border-red-300 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </div>

      {/* Upload modal */}
      <UploadModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default TopNav;
