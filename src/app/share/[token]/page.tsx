"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [needPassword, setNeedPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      accessShare(token);
    }
  }, [token]);

const accessShare = async (t: string) => {
  try {
    setLoading(true);
    const res = await api.get(`/api/shares/${t}`, {
      responseType: "blob",
      validateStatus: () => true, // har case capture hoga
    });

    // 🔹 Agar backend ne password_required diya
    if (res.status === 401) {
      try {
        const text = await res.data.text(); // blob ko string me badal
        const json = JSON.parse(text);
        if (json.error === "password_required") {
          setNeedPassword(true);   // 🔑 modal open
          setLoading(false);
          return;
        }
      } catch {
        setError("Unauthorized access");
        setLoading(false);
        return;
      }
    }

    // 🔹 Agar forbidden / invalid link hai
    if (res.status === 403) {
      const text = await res.data.text();
      const json = JSON.parse(text);
      setError(json.error || "Link invalid or expired.");
      setLoading(false);
      return;
    }

    // 🔹 Normal flow
    const contentType = res.headers["content-type"];

    if (contentType && contentType.includes("application/json")) {
      const text = await res.data.text();
      const json = JSON.parse(text);
      if (json.redirect) {
        window.location.href = json.redirect;
      }
    } else {
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // filename backend se nikaalo
      let filename = "shared_file";
      const contentDisposition = res.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) filename = match[1];
      }

      a.download = filename;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }

    setLoading(false);
  } catch (err) {
    console.error("download error", err);
    setLoading(false);
    setError("Link invalid or expired.");
  }
};



  const validatePassword = async () => {
  try {
    setLoading(true);

    const res = await api.post(
      `/api/shares/${token}/validate`,
      { password },
      {
        responseType: "blob",
        validateStatus: () => true, // 200, 400, ya JSON sab handle hoga
      }
    );

    const contentType = res.headers["content-type"];

    if (contentType && contentType.includes("application/json")) {
      // 🔹 JSON response (redirect case ya error)
      const text = await res.data.text(); // blob ko text banaya
      const json = JSON.parse(text);

      if (json.redirect) {
        window.open(json.redirect, "_blank"); // MinIO direct URL
      } else if (json.error) {
        setError(json.error);
      } else {
        setError("Unexpected response");
      }
    } else {
      // 🔹 Blob download case
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // filename backend header se nikaal lo
      let filename = "shared_file";
      const contentDisposition = res.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match?.[1]) filename = match[1];
      }

      a.download = filename;
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }

    setLoading(false);
  } catch (err) {
    setLoading(false);
    setError("Invalid password, please try again.");
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Processing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (needPassword) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white shadow-md rounded-lg p-6 w-[360px]">
          <h3 className="text-lg font-semibold mb-4">Password Required</h3>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={validatePassword} disabled={loading}>
              Unlock & Download
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Download should start automatically...</p>
    </div>
  );
}
