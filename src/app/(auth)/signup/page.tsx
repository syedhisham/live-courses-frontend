"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerApi } from "@/api/authApis";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerApi({ name, email, password, role });
      router.push(`/login?role=${role}`);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center justify-center px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48 2xl:px-64">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 border border-zinc-200 dark:border-zinc-700">
        <h1 className="text-zinc-900 dark:text-white text-4xl font-extrabold mb-10 text-center">
          Register as {role.charAt(0).toUpperCase() + role.slice(1)}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name */}
          <label className="flex flex-col text-zinc-900 dark:text-white font-semibold text-sm">
            Full Name
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 p-3 rounded border border-zinc-700 bg-transparent"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col text-zinc-900 dark:text-white font-semibold text-sm">
            Email
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 rounded border border-zinc-700 bg-transparent"
            />
          </label>

          {/* Password */}
          <label className="flex flex-col text-zinc-900 dark:text-white font-semibold text-sm">
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-2 p-3 rounded border border-zinc-700 bg-transparent"
            />
          </label>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg shadow-lg"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-700 dark:text-zinc-300">
          Already have an account?{" "}
          <Link
            href={`/login?role=${role}`}
            className="text-blue-600 dark:text-blue-400 font-semibold underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
