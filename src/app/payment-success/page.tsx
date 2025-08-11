"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      console.warn("No session_id found in URL");
    }
  }, [sessionId]);

  const handleGoToCourses = () => {
    setIsLoading(true);
    router.push("/dashboard/student/courses");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gray-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-lg w-full bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8 text-center border border-gray-200 dark:border-zinc-800">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">
          Payment Successful 🎉
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
          Your payment has been confirmed. Thank you for your purchase!  
          You can now access your enrolled courses in your dashboard.
        </p>

        {sessionId && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-mono break-all">
              Session ID: {sessionId}
            </span>
          </div>
        )}

        <button
          onClick={handleGoToCourses}
          disabled={isLoading}
          className={`mt-8 w-full sm:w-auto px-6 py-3 rounded-lg font-medium shadow transition 
            ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          `}
        >
          {isLoading ? "Redirecting..." : "Go to My Courses"}
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentSuccess />
      </Suspense>
    );
} 
