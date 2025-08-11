"use client";

import Image from "next/image";
import { FileText, CalendarDays, DollarSign } from "lucide-react";

interface Material {
  key: string;
  url: string;
  filename: string;
  contentType: string;
  uploadedAt: string;
  _id: string;
}

interface CourseCardProps {
  title: string;
  description: string;
  price: number;
  instructor: string;
  materials: Material[];
  createdAt: string;
  onEnroll?: () => void;
  loading?: boolean;
}

export default function CourseCard({
  title,
  description,
  price,
  instructor,
  materials,
  createdAt,
  onEnroll,
   loading = false,
}: CourseCardProps) {
  const courseImage =
    materials.length > 0 && materials[0].contentType.includes("video")
      ? "/assets/video-image.png"
      : "/assets/files-image.png";

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 transition hover:shadow-xl">
      {/* Header */}
      <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-4">
        <h2 className="text-zinc-800-600 dark:text-white text-xl font-bold">
          {title}
        </h2>
        <p className="text-gray-400  text-sm">by {instructor}</p>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-4">
        <div className="relative w-full h-48">
          <Image
            src={courseImage}
            alt="Course illustration"
            fill
            className="object-contain rounded-md"
          />
        </div>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-zinc-100 dark:bg-zinc-800 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <DollarSign className="w-5 h-5" />
          <span className="font-semibold">${price}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <CalendarDays className="w-5 h-5" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        {materials.length > 0 && (
          <a
            href={materials[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FileText className="w-5 h-5" />
            {materials[0].filename}
          </a>
        )}
        {/* Enroll Button */}
        {onEnroll && (
          <button
            onClick={onEnroll}
            disabled={loading}
            className={`mt-2 px-4 py-2 rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Processing..." : "Enroll Now"}
          </button>
        )}
      </div>
    </div>
  );
}
