"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AIEnhance({ project }) {
  const [loading, setLoading] = useState(false);

  async function enhance() {
    setLoading(true);

    const res = await fetch("/api/ai-enhance", {
      method: "POST",
      body: JSON.stringify({ imageUrl: project.imageUrl }),
    });

    const data = await res.json();

    console.log("Enhanced image:", data.enhancedImage);

    // TODO: Replace canvas image with enhanced version
    setLoading(false);
  }

  return (
    <div className="space-y-4 text-white">
      <p className="text-sm">
        Use AI to upscale image quality and resolution.
      </p>

      <Button className="w-full" onClick={enhance} disabled={loading}>
        {loading ? "Enhancing..." : "Enhance Image"}
      </Button>
    </div>
  );
}
