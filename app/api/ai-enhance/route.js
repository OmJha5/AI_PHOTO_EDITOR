import { NextResponse } from "next/server";

export async function POST(req) {
  const { imageUrl } = await req.json();

  if (!imageUrl) {
    return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
  }

  // 100% working endpoint
  const ENDPOINT =
    "https://hf.space/embed/gokaygokay/NoobAI-Animagine-T-ponynai3/api/predict/";

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [imageUrl], // Gradio input format
      }),
    });

    const text = await response.text();

    console.log("🔍 RAW HF RESPONSE:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      return NextResponse.json(
        {
          error: "HF returned invalid JSON",
          raw: text,
        },
        { status: 500 }
      );
    }

    if (!result?.data || !result.data[0]) {
      return NextResponse.json(
        { error: "Enhancement failed", details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({
      enhancedImage: result.data[0],
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
