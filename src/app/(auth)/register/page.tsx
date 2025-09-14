"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await api.post("/api/register", { username, email, password });
      console.log(res);
      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (err) {
      toast.error(
        (err as { response?: { data?: { error: string } } }).response?.data?.error ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gray-50">
      {/* Background with gradient and subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      <div className="absolute inset-0 bg-grid-small-black/[0.05] pointer-events-none" />

      {/* Card */}
      <Card className="relative w-[420px] shadow-2xl border border-gray-200/60 bg-white/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            ✨ Create Your Account
          </CardTitle>
          <p className="text-center text-gray-500 text-sm mt-1">
            Join us and get started today
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              className="bg-white/70 mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
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
            onClick={handleRegister}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 shadow-md"
          >
            Sign Up
          </Button>

          {/* Back to login */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
