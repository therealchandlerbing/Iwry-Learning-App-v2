"use client";

import { Camera, Upload, Sparkles } from "lucide-react";

export default function PhotoAnalysisPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Camera className="h-8 w-8 text-[#10b981]" />
            <h1 className="text-3xl font-bold text-foreground">
              Photo Analysis
            </h1>
          </div>
          <p className="text-muted-foreground">
            Upload a photo to learn Portuguese vocabulary from real-world context.
          </p>
        </div>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center bg-[#1e2433]/50 hover:border-[#10b981]/50 transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#10b981]/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-[#10b981]" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                Drop an image here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-8 p-4 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#a855f7]" />
            <div>
              <p className="text-sm font-medium text-foreground">Coming Soon</p>
              <p className="text-xs text-muted-foreground">
                AI-powered image analysis to identify objects and teach you their Portuguese names.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
