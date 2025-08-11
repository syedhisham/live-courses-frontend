"use client";

import React, { useEffect, useState } from "react";
import { listAllMyPurchasedCoursesApi } from "@/api/courseApis";
import { Loader2 } from "lucide-react";
import CourseCard from "@/components/dashboard/cards/courseCard/CourseCard";

const Page = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await listAllMyPurchasedCoursesApi();
        if (res?.status) {
          setCourses(res.data || []);
        } else {
          setError(res?.message || "Failed to fetch courses");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Purchased Courses</h1>
      {courses.length === 0 ? (
        <p className="text-gray-500">You have not purchased any courses yet.</p>
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
