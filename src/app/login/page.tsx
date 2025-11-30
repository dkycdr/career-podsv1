"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, ArrowLeft, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.name);
        // Redirect to dashboard
        window.location.href = `/success?userId=${data.user.id}`;
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md glass-alt card-border border-slate-700/50 bg-slate-900/40 relative z-10">
        <CardHeader className="text-center">
          <div className="w-12 h-12 gradient-brand rounded-lg flex items-center justify-center mx-auto mb-4 glow-md">
            <Users className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl gradient-text">
            Sign In
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-slate-300">
                <Lock className="w-4 h-4 text-cyan-400" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            {error && (
              <Alert className="border-red-500/30 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full gradient-brand btn-glow font-semibold"
              disabled={loading || !email || !password}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Sign up now
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-300">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </div>

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Demo Login</span>
            </div>
            <p className="text-xs text-slate-400">
              Use an email that's already registered. If you don't have an account, please sign up first.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}