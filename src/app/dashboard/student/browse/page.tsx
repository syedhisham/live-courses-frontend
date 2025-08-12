"use client";

import { useEffect, useState } from "react";
import { listAllCoursesApi } from "@/api/courseApis";
import CourseCard from "@/components/dashboard/cards/courseCard/CourseCard";
import { Loader2, ShoppingBag } from "lucide-react";
import { createCheckoutSessionApi } from "@/api/paymentApis";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const { toasts, removeToast, success, error: showError } = useToast();

 const fetchCourses = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await listAllCoursesApi();

    if (res?.status) {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCourses(res.data);
      } else {
        // No courses — not an error
        setCourses([]);
        setError(null);
      }
    } else {
      const errorMessage =
        res?.message ||
        "Failed to load courses. Please check your connection and try again.";
      setError(errorMessage);
    }
  } catch (err: any) {
    const errorMessage =
      err.message ||
      "Failed to load courses. Please check your connection and try again.";
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (course: any) => {
    try {
      setEnrollingId(course._id);

      const session = await createCheckoutSessionApi({
        courseId: course._id,
      });

      if (session?.data?.url) {
        success("Redirecting to checkout...");
        window.location.href = session?.data?.url;
      } else {
        throw new Error("Invalid checkout session response. Please try again.");
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Failed to start checkout. Please try again.";
      showError(errorMessage);
    } finally {
      setEnrollingId(null);
    }
  };

  const handleRetry = () => {
    fetchCourses();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <>
      <div className="p-6">
        {/* Refresh Button */}
        {courses.length > 0 && (
          <div className="flex justify-start mb-4">
            <button
              onClick={handleRetry}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Refresh Courses
                </>
              )}
            </button>
          </div>
        )}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Available Courses</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShoppingBag className="w-4 h-4" />
            <span>
              {courses.length} course{courses.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            title="No courses available"
            description="There are no courses available at the moment. Please check back later."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-smooth">
            {courses.map((course: any) => (
              <CourseCard
                key={course._id}
                title={course.title}
                description={course.description}
                price={course.price}
                instructor={course.instructor?.name || "Unknown Instructor"}
                materials={course.materials || []}
                createdAt={course.createdAt}
                onEnroll={() => handleEnroll(course)}
                loading={enrollingId === course._id}
                
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
}
