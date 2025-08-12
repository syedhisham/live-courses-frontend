"use client";

import React, { useEffect, useState } from "react";
import { listAllMyPurchasedCoursesApi } from "@/api/courseApis";
import { Loader2, ShoppingBag } from "lucide-react";
import CourseCard from "@/components/dashboard/cards/courseCard/CourseCard";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { getMaterialAccessUrlApi } from "@/api/courseApis";

const Page = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toasts, removeToast, error: showError } = useToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await listAllMyPurchasedCoursesApi();

      if (res?.status) {
        if (res.data && res.data.length > 0) {
          setCourses(res.data);
        } else {
          // No courses found, clear error and let UI show EmptyState
          setCourses([]);
          setError(null);
        }
      } else {
        const errorMessage =
          res?.message || "Failed to fetch purchased courses";
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Something went wrong while fetching your courses";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchMaterial = async (courseId: string, materialId: string) => {
    try {
      const res = await getMaterialAccessUrlApi(courseId, materialId);
      if (res.success && res.url) {
        window.open(res.url, "_blank");
      } else {
        showError("Unable to get access URL");
      }
    } catch (error: any) {
      showError(error.message || "Failed to fetch video url");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleRetry = () => {
    fetchCourses();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading your purchased courses...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (courses.length === 0) {
    return (
      <>
        <EmptyState
          title="No courses available"
          description="There are no courses available at the moment. Please check back later."
        />
        <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      </>
    );
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
          <h1 className="text-2xl font-semibold">My Purchased Courses</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShoppingBag className="w-4 h-4" />
            <span>
              {courses.length} course{courses.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            title="No purchased courses yet"
            description="You haven't purchased any courses yet. Browse our course catalog to find courses that interest you."
            icon={<ShoppingBag className="w-8 h-8 text-gray-400" />}
            action={
              <button
                onClick={() =>
                  (window.location.href = "/dashboard/student/courses")
                }
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Browse Courses
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <CourseCard
                key={course._id}
                title={course.title}
                description={course.description}
                price={course.price}
                instructor={course.instructor?.name || "Unknown Instructor"}
                materials={course.materials || []}
                session={course.sessions && course.sessions.length > 0 ? course.sessions[0] : null}
                onWatchMaterial={(materialId: string) =>
                  handleWatchMaterial(course._id, materialId)
                }
                createdAt={course.createdAt}
                showWatchButtons={true}
                hideMaterials={false}
                hideInstructor={false}
                showSessionInfoForStudent={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
};

export default Page;