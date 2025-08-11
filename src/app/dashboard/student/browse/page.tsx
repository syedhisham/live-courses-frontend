"use client";

import { useEffect, useState } from "react";
import { listAllCoursesApi } from "@/api/courseApis";
import CourseCard from "@/components/dashboard/cards/courseCard/CourseCard";
import { Loader2 } from "lucide-react";
import { createCheckoutSessionApi } from "@/api/paymentApis";

export default function Page() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null); // loading state per course

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await listAllCoursesApi();
        setCourses(res.data); // API returns { status, message, data }
      } catch (err: any) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (course: any) => {
    try {
      setEnrollingId(course._id);
        console.log("This is enrolling Id",enrollingId);
      const session = await createCheckoutSessionApi({
        courseId: course._id
      });

      console.log("This is session bro: ",session);
      

      // Assuming your backend returns { url: "stripe-checkout-url" }
      if (session?.data?.url) {
        window.location.href = session?.data?.url;
      } else {
        throw new Error("Invalid checkout session response");
      }
    } catch (err: any) {
      alert(err.message || "Failed to start checkout");
    } finally {
      setEnrollingId(null);
    }
  };


  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Available Courses</h1>
      {courses.length === 0 ? (
        <p className="text-gray-500">No available courses yet</p>
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
              createdAt={course.createdAt}
              onEnroll={() => handleEnroll(course)}
              loading={enrollingId === course._id} // optional loading state for button
            />
          ))}
        </div>
      )}
    </div>
  );
}
