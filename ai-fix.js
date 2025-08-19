// ai-fix.js
// Script ini pakai Google Gemini AI untuk cek & perbaiki bug di index.html

import fs from "fs";
import { GoogleGenAI } from "@google/genai";

// Ambil API key dari environment variable (GEMINI_KEY)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

async function askGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    return response.text || "No response from AI";
  } catch (err) {
    console.error("❌ Error saat panggil Gemini AI:", err);
    return null;
  }
}

(async () => {
  console.log("🔍 Mengecek bug di index.html ...");

  if (!fs.existsSync("index.html")) {
    console.error("❌ File index.html tidak ditemukan di root repo!");
    process.exit(1);
  }

  const code = fs.readFileSync("index.html", "utf8");

  const prompt = `
Periksa kode berikut untuk bug HTML/JS, dan berikan versi perbaikan:
${code}
Hanya ubah yang perlu diperbaiki. Jangan hapus fitur yang ada.
`;

  const fixed = await askGemini(prompt);

  if (!fixed) {
    console.error("❌ AI tidak memberikan respons. Coba lagi nanti.");
    return;
  }

  fs.writeFileSync("index.html", fixed, "utf8");
  console.log("✅ Selesai, index.html diperbarui oleh AI!");
})();
