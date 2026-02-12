"use client";

import { AlertCircle, X, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isDeleting?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isDeleting = false,
}: DeleteModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (typeof document === "undefined" || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center 
                 bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm 
                   p-6 relative animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          disabled={isDeleting}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-500" size={24} />
          </div>

          <h3 className="text-xl font-bold text-[#1F4F46] mb-2">{title}</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {description}
          </p>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 
                        text-gray-600 font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-medium 
                        hover:bg-red-600 transition shadow-sm flex items-center 
                        justify-center gap-2 disabled:opacity-70"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
