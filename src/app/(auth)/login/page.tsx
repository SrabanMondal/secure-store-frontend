"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/login", { email, password });
      setToken(res.data.token);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(
        (err as { response?: { data?: { error: string } } }).response?.data?.error ||
          "Login failed"
      );
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Elegant dot background */}
      <div className="absolute inset-0 bg-dot-black/[0.15] bg-white" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 via-white to-purple-50/50" />

      {/* Auth card */}
      <Card className="relative w-[400px] shadow-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            ⚡ Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white/70 mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="bg-white/70 mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <Button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-md"
          >
            Sign In
          </Button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
