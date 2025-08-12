"use client";

import React, { useState } from "react";
import {
  createCourseApi,
  getUploadUrlApi,
  addMaterialApi,
} from "@/api/courseApis";
import axios from "axios";
import {
  BookOpen,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react";
import { scheduleLiveSessionApi } from "@/api/sessionApis";

const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200MB

export default function InstructorCourseUploader() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [course, setCourse] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [sessionScheduled, setSessionScheduled] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !price) return setError("Title and price are required");
    setError(null);
    setLoading(true);
    try {
      const res = await createCourseApi({
        title,
        description,
        price: Number(price),
      });
      if (!res.status) throw new Error(res.message || "Create failed");
      setCourse(res.data);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) {
      setError("File is too large. Max 200MB.");
      return;
    }
    setFile(f);
    setError(null);
  }

  async function handleUpload() {
    if (!file) return setError("Select a file first");
    if (!course) return setError("Create a course first");

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Step 1: Get presigned upload URL
      const upRes = await getUploadUrlApi(course._id, {
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
      });
      if (!upRes.status)
        throw new Error(upRes.message || "Failed to get upload URL");

      const { uploadURL, key } = upRes.data;

      // Step 2: Upload file to S3
      await axios.put(uploadURL, file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      // Step 3: Register file in backend
      const addRes = await addMaterialApi(course._id, {
        key,
        filename: file.name,
        contentType: file.type,
      });

      if (!addRes.status)
        throw new Error(addRes.message || "Failed to add material");

      setMaterials((prev) => [
        ...prev,
        addRes.data.materials?.slice(-1)[0] || { key, filename: file.name },
      ]);

      setFile(null);
      setProgress(0);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  function handleNextToSchedule() {
    if (materials.length === 0) {
      setError("Please upload at least one material before proceeding");
      return;
    }
    setCurrentStep(3);
    setError(null);
  }

  async function handleScheduleSession(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionDate || !sessionTime) {
      return setError("Please select both date and time for the session");
    }
    if (!course) return setError("Course not found");

    setLoading(true);
    setError(null);

    try {
      // Treat input as PKT (local) and convert to UTC automatically
      const localDateTime = new Date(`${sessionDate}T${sessionTime}`);

      const res = await scheduleLiveSessionApi({
        courseId: course._id,
        startTime: localDateTime.toISOString(), // backend gets UTC
      });

      if (!res.status)
        throw new Error(res.message || "Failed to schedule session");

      setSessionScheduled(true);
    } catch (err: any) {
      setError(err.message || "Failed to schedule session");
    } finally {
      setLoading(false);
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Create Course
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {currentStep === 1
              ? "Start by creating your course with basic information"
              : currentStep === 2
              ? "Add materials and resources to your course"
              : "Schedule a live session for your course"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 sm:space-x-8">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  course
                    ? "bg-blue-600 border-blue-600"
                    : "border-blue-600 bg-white dark:bg-zinc-900"
                }`}
              >
                {course ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-blue-600 font-semibold">1</span>
                )}
              </div>
              <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-zinc-900 dark:text-white">
                Course Details
              </span>
            </div>

            {/* Arrow 1 */}
            <ArrowRight
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                course ? "text-blue-600" : "text-zinc-400"
              }`}
            />

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  currentStep >= 2
                    ? "border-blue-600 bg-white dark:bg-zinc-900"
                    : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                }`}
              >
                <span
                  className={`font-semibold ${
                    currentStep >= 2
                      ? "text-blue-600"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  2
                </span>
              </div>
              <span
                className={`ml-2 sm:ml-3 text-xs sm:text-sm font-medium ${
                  currentStep >= 2
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                Add Materials
              </span>
            </div>

            {/* Arrow 2 */}
            <ArrowRight
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                currentStep >= 3 ? "text-blue-600" : "text-zinc-400"
              }`}
            />

            {/* Step 3 */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  sessionScheduled
                    ? "bg-blue-600 border-blue-600"
                    : currentStep >= 3
                    ? "border-blue-600 bg-white dark:bg-zinc-900"
                    : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                }`}
              >
                {sessionScheduled ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <span
                    className={`font-semibold ${
                      currentStep >= 3
                        ? "text-blue-600"
                        : "text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    3
                  </span>
                )}
              </div>
              <span
                className={`ml-2 sm:ml-3 text-xs sm:text-sm font-medium ${
                  currentStep >= 3
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400 dark:text-zinc-500"
                }`}
              >
                Schedule Session
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {currentStep === 1 ? (
            // Step 1: Create Course Form
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                  Course Information
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  Provide the basic details for your new course
                </p>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter course title"
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will learn in this course"
                    rows={4}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                    Price (PKR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400">
                      Rs
                    </span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value) || "")}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Set to 0 for free courses
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !title || !price}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 dark:disabled:bg-zinc-600 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Course...
                      </>
                    ) : (
                      <>
                        Create Course
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : currentStep === 2 ? (
            // Step 2: Add Materials
            <div className="p-6 sm:p-8">
              {/* Course Header */}
              <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
                      {course.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">
                      {course.description || "No description provided"}
                    </p>
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                      Rs {course.price}
                    </span>
                  </div>
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                </div>
              </div>

              {/* Upload Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                  Upload Course Materials
                </h3>

                {/* File Upload */}
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                    </div>

                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />

                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Choose File
                    </label>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      Maximum file size: {formatFileSize(MAX_FILE_BYTES)}
                    </p>

                    {file && (
                      <div className="mt-4 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          Selected:{" "}
                          <span className="font-medium">{file.name}</span>
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                {file && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 dark:disabled:bg-zinc-600 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Material
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Upload Progress
                      </span>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Materials List */}
              {materials.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                    Course Materials ({materials.length})
                  </h3>
                  <div className="space-y-3">
                    {materials.map((material: any, index: number) => (
                      <div
                        key={material._id || material.key || index}
                        className="flex items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-lg flex items-center justify-center mr-4">
                          <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-zinc-900 dark:text-white truncate">
                            {material.filename || material.key}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Material {index + 1}
                          </p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-4" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Step Button */}
              {materials.length > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={handleNextToSchedule}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 flex items-center gap-2 cursor-pointer"
                  >
                    Next: Schedule Session
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Step 3: Schedule Live Session
            <div className="p-6 sm:p-8">
              {/* Course Header */}
              <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">
                      {course.title}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">
                      {materials.length} materials uploaded
                    </p>
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full">
                      Rs {course.price}
                    </span>
                  </div>
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                </div>
              </div>

              {!sessionScheduled ? (
                // Schedule Session Form
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                      Schedule Live Session
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                      Set up a live session for your students
                    </p>
                  </div>

                  <form onSubmit={handleScheduleSession} className="space-y-6">
                    {/* Date Input */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                        Session Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <input
                          type="date"
                          value={sessionDate}
                          onChange={(e) => setSessionDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    {/* Time Input */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-900 dark:text-white mb-2">
                        Session Time *
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <input
                          type="time"
                          value={sessionTime}
                          onChange={(e) => setSessionTime(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Time will be in UTC. Make sure to adjust for your
                        timezone.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading || !sessionDate || !sessionTime}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 dark:disabled:bg-zinc-600 text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Scheduling Session...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4" />
                            Schedule Session
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // Success Message
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    Course Created Successfully!
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    Your course &quot;{course.title}&quot; has been created with{" "}
                    {materials.length} materials and a live session scheduled.
                  </p>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 inline-block">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      <strong>Session scheduled for:</strong>
                      <br />
                      {sessionDate} at {sessionTime} UTC
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
