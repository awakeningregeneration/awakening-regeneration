"use client";

import { useEffect, useRef, useCallback } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  // Focus trap + scroll lock
  useEffect(() => {
    if (!isOpen) return;

    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    // Focus the dialog
    setTimeout(() => dialogRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "rgba(8,25,45,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        animation: "modalFadeIn 0.2s ease",
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 640,
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: 20,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(220,235,255,0.95) 0%, rgba(245,248,255,0.97) 50%, rgba(255,255,255,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
          padding: "clamp(20px, 4vw, 32px)",
          position: "relative",
          animation: "modalSlideUp 0.25s ease",
          outline: "none",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            color: "#3a5a7a",
            fontSize: 20,
            cursor: "pointer",
            borderRadius: "50%",
            transition: "color 0.15s",
          }}
        >
          ×
        </button>

        {/* Title */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#8a6d2a",
            marginBottom: 16,
          }}
        >
          {title}
        </div>

        {/* Content */}
        <div style={{ color: "#1a2a3a", fontSize: 15, lineHeight: 1.7 }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          [role="dialog"] {
            max-width: 100% !important;
            max-height: 100vh !important;
            height: 100vh !important;
            border-radius: 0 !important;
            animation: modalSlideUpMobile 0.3s ease !important;
          }
        }
        @keyframes modalSlideUpMobile {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
