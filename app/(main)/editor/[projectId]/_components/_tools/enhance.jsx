"use client";

import { useState } from "react";
import { useCanvas } from "@/context/context";
import { toast } from "sonner";

export function EnhanceControls() {
  const { canvasEditor, setProcessingMessage } = useCanvas();
  const [loading, setLoading] = useState(false);

  const enhanceImage = async () => {
    if (!canvasEditor) {
      toast.error("Canvas is still loading… try again in 1–2 seconds");
      return;
    }

    const obj = canvasEditor.getObjects().find(o => o.type === "image");

    if (!obj) {
      toast.error("Select or load an image first");
      return;
    }

    const originalUrl = obj._originalElement?.src || obj.src;

    if (!originalUrl) {
      toast.error("Image source missing");
      return;
    }

    try {
      setLoading(true);
      setProcessingMessage("Enhancing image…");

      const res = await fetch("/api/ai-enhance", {
        method: "POST",
        body: JSON.stringify({ imageUrl: originalUrl }),
      });

      const data = await res.json();

      if (!data?.enhancedImage) {
        toast.error("Enhancement failed");
        console.log("ENHANCE ERROR:", data);
        return;
      }

      // Replace image on canvas
      fabric.Image.fromURL(data.enhancedImage, (newImg) => {
        newImg.set({
          left: obj.left,
          top: obj.top,
          originX: "center",
          originY: "center",
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
        });

        canvasEditor.remove(obj);
        canvasEditor.add(newImg);
        canvasEditor.renderAll();

        toast.success("Image enhanced!");
      });
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
      setProcessingMessage(null);
    }
  };

  return (
    <div className="p-4">
      <button
        disabled={loading}
        onClick={enhanceImage}
        className="px-4 py-2 bg-cyan-500 text-white rounded"
      >
        {loading ? "Enhancing..." : "Enhance Image"}
      </button>
    </div>
  );
}
