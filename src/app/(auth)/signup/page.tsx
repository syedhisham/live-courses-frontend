"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { registerApi } from "@/api/authApis";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";
import { Loader2 } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";
  const { toasts, removeToast, success, error: showError } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerApi({ name, email, password, role });
      
      // Show success message
      success("Registration successful! Redirecting to login...");
      
      // Small delay to show the success message before redirect
      setTimeout(() => {
        router.push(`/login?role=${role}`);
      }, 1500);

    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again with different credentials.";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                disabled={loading}
                className="mt-2 p-3 rounded border border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading}
                className="mt-2 p-3 rounded border border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading}
                className="mt-2 p-3 rounded border border-zinc-700 bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-lg shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-zinc-700 dark:text-zinc-300">
            Already have an account?{" "}
            <Link
              href={`/login?role=${role}`}
              className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-zinc-700 dark:hover:text-zinc-400 transition"
            >
              Login here
            </Link>
          </p>
          <p className="mt-4 text-center font-semibold text-zinc-700 dark:text-zinc-300 text-sm">
            Choose role{" "}
            <Link
              href={`/`}
              className="text-blue-600 dark:text-blue-400 underline hover:text-zinc-700 dark:hover:text-zinc-400 transition"
            >
              Click here
            </Link>
          </p>
        </div>
      </main>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading...
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}