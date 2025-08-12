"use client";

import Image from "next/image";
import { FileText, CalendarDays, DollarSign, Loader2 } from "lucide-react";

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
  onWatch?: () => void;
  onWatchMaterial?: (materialId: string) => void;
  showWatchButtons?: boolean;
    hideMaterials?: boolean;
    
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
  onWatch,
  onWatchMaterial,
  showWatchButtons = false,
    hideMaterials = false,
}: CourseCardProps) {
  const courseImage =
    materials.length > 0 && materials[0].contentType.includes("video")
      ? "/assets/video-image.png"
      : "/assets/files-image.png";

  return (
    <div className="group relative w-full max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Course Image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 overflow-hidden">
        <Image
          src={courseImage}
          alt="Course illustration"
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="text-sm font-bold">{price}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Instructor */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            by {instructor}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Course Details */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>

          {/* Materials List */}
          {hideMaterials && materials.length > 0 && (
            <div className="mt-4 space-y-2">
              {materials.map((material) => (
                <div
                  key={material._id}
                  className="flex justify-between items-center"
                >
                  {showWatchButtons ? (
                    <div className="flex flex-col">
                      <span
                        className="truncate max-w-[200px]"
                        title={material.filename}
                      >
                        {material.filename}
                      </span>
                      <button
                        onClick={() =>
                          onWatchMaterial && onWatchMaterial(material._id)
                        }
                        disabled={loading}
                        className="bg-blue-400 dark:bg-blue-600 rounded-xl p-0.5 mt-1 text-lg font-medium"
                      >
                        Open
                      </button>
                    </div>
                  ) : (
                    <a
                      href={material.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium truncate max-w-[200px]"
                      title={material.filename}
                      onClick={(e) => {
                        // prevent default if no URL
                        if (!material.url) e.preventDefault();
                        // optionally handle click in parent if needed
                      }}
                    >
                      {material.filename}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enroll Button */}
        {onEnroll && (
          <button
            onClick={onEnroll}
            disabled={loading}
            className="w-full mt-4 px-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Processing..." : "Enroll Now"}
          </button>
        )}
        {onWatch && (
          <button
            onClick={onWatch}
            disabled={loading}
            className="w-full mt-4 px-4 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Processing..." : "Watch Now"}
          </button>
        )}
      </div>
    </div>
  );
}
