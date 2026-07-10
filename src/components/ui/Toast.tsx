"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const iconMap = {
  success: <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
};

const bgMap = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

export const Toast: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const enterTimeout = setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const dismissTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      clearTimeout(enterTimeout);
      clearTimeout(dismissTimeout);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-[100] max-w-sm w-full transition-all duration-300 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
      }`}
    >
      <div
        className={`flex items-start space-x-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm ${bgMap[type]}`}
      >
        {iconMap[type]}
        <p className="text-sm font-medium leading-relaxed flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="p-0.5 hover:opacity-70 transition-opacity shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
