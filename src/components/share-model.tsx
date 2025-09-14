// src/components/share-modal.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  fileId: string;
}

interface ShareLink {
  id: string;
  token: string;
  expires_at: string;
  password?: string;
}

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export default function ShareModal({ open, onClose, fileId }: ShareModalProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [loading, setLoading] = useState(false);

  const [expiry, setExpiry] = useState(24);
  const [password, setPassword] = useState("");

  const fetchShareLinks = useCallback(async () => {
   try {
     const res = await api.get(`/api/shares/get/${fileId}`);
     setShareLinks(res.data.links || []);
   } catch (err) {
     console.log(err);
     setShareLinks([]);
   }
 }, [fileId]);

  useEffect(() => {
    if (open && fileId) fetchShareLinks();
  }, [open, fileId, fetchShareLinks]);


  const createShareLink = async () => {
    try {
      setLoading(true);
      await api.post("/api/shares", {
        file_id: fileId,
        expiry_hours: expiry,
        password: password || undefined,
      });
      await fetchShareLinks();
    } catch (err) {
      console.error(err)
      toast.error("Failed to create share link");
    } finally {
      setLoading(false);
      setPassword("");
      setExpiry(24);
    }
  };

  const deleteShareLink = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/api/shares/${id}`);
      setShareLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.log(err)
      toast.error("Failed to delete share link");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (token: string) => {
    const url = `${FRONTEND_URL}/share/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-xl p-6 z-10 w-[560px] max-h-[85vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-5">🔗 Share File</h3>

        {/* Existing links */}
        {shareLinks.length > 0 ? (
          <div className="space-y-3 mb-6">
            <h4 className="font-medium text-gray-700">Existing Links</h4>
            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
              {shareLinks.map((link) => {
                const url = `${FRONTEND_URL}/share/${link.token}`;
                return (
                  <div
                    key={link.id}
                    className="flex items-start justify-between border rounded-lg p-3 hover:shadow-sm transition"
                  >
                    <div className="flex-1 pr-2">
                      <div
                        className="text-sm font-mono text-blue-600 truncate"
                        title={url}
                      >
                        {url}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Expires:{" "}
                        {new Date(link.expires_at).toLocaleString()}{" "}
                        {link.password && (
                          <span className="ml-1">
                            | Password:{" "}
                            <span className="font-semibold text-gray-700">
                              {link.password}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyLink(link.token)}
                      >
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteShareLink(link.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-6">
            No share links yet. Create one below.
          </p>
        )}

        {/* Create new link */}
        <div className="space-y-3 border-t pt-4">
          <h4 className="font-medium text-gray-700">Create New Link</h4>

          <div>
            <label className="block text-sm text-gray-600">
              Expiry (hours)
            </label>
            <input
              type="number"
              min={1}
              value={expiry}
              onChange={(e) => setExpiry(Number(e.target.value))}
              className="w-full p-2 border rounded-lg mt-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">
              Password (optional)
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg mt-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Set password protection"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button onClick={createShareLink} disabled={loading}>
              {loading ? "Creating..." : "Create Link"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
