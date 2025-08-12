import React from "react";
import { ImageOff } from "lucide-react"; // Lucide icon

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="bg-gray-50 rounded-full p-3 mb-4">
      {icon || <ImageOff className="w-8 h-8 text-gray-400" />}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
    {action && action}
  </div>
);

export default EmptyState;
