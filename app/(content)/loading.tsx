import React from "react";

export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="relative w-20 h-20">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin"></div>
          {/* Inner Circle */}
          <div className="absolute inset-4 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin-reverse"></div>
          {/* Center Dot */}
          <div className="absolute inset-8 rounded-full bg-primary"></div>
        </div>
      </div>
    );
  }
  