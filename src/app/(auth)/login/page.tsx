"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { loginApi } from "@/api/authApis";
import { fetchMeApi } from "@/api/userApis";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginApi({ email, password });

      const response = await fetchMeApi();

      // response.data.user contains the user object
      dispatch(setUser(response.data.user));

      if (role === "instructor") {
        router.push("/dashboard/instructor");
      } else {
        router.push("/dashboard/student");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center justify-center px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48 2xl:px-64">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 border border-zinc-200 dark:border-zinc-700">
        <h1 className="text-zinc-900 dark:text-white text-4xl font-extrabold mb-10 select-none text-center capitalize">
          {role} Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="flex flex-col text-zinc-900 dark:text-white font-semibold text-sm">
            Email
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 rounded border border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
            />
          </label>

          <label className="flex flex-col text-zinc-900 dark:text-white font-semibold text-sm">
            Password
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-2 p-3 rounded border border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
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
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-700 dark:text-zinc-300">
          Don&apos;t have an account?{" "}
          <Link
            href={`/signup?role=${role}`}
            className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-zinc-700 dark:hover:text-zinc-400 transition"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
