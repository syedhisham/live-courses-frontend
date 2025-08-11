"use client";

import { useRouter } from "next/navigation";

export default function RoleSelector() {
  const router = useRouter();

  const selectRole = (role: "instructor" | "student") => {
    router.push(`/login?role=${role}`);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-900 flex flex-col items-center justify-center px-6 sm:px-12 md:px-24 lg:px-32 xl:px-48 2xl:px-64">
      <h1 className="text-zinc-900 dark:text-white text-4xl sm:text-5xl font-extrabold mb-12 select-none">
        Select Your Role
      </h1>
      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-md">
        {["instructor", "student"].map((role) => (
          <button
            key={role}
            onClick={() => selectRole(role as "instructor" | "student")}
            className="flex-1 py-5 rounded-lg border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-lg font-semibold tracking-wide 
                       transition-colors duration-300
                       hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900
                       focus:outline-none focus-visible:ring-4 focus-visible:ring-zinc-900 dark:focus-visible:ring-white
                       select-none cursor-pointer"
            aria-label={`Select ${role} role`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </main>
  );
}
