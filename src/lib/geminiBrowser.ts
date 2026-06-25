
export async function geminiEnhance(imageDataUrl: string): Promise<string> {
  const key = localStorage.getItem("nicolas_gemini_key") || "";
  if (!key) throw new Error("No Gemini API key in Settings.");
  const m = imageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!m) throw new Error("Invalid image");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Colorize this TIR image." }, { inlineData: { mimeType: m[1], data: m[2] } }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });
  const json = await res.json();
  const part = json?.candidates?.[0]?.content?.parts?.[0];
  if (part?.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
  throw new Error("Gemini failed");
}
