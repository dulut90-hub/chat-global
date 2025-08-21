// ai-fix.js
// Script ini pakai Google Gemini AI untuk cek & perbaiki bug di index.html
// + simpan hasil & log ke Firebase Firestore

import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// 🔑 Ambil API key dari environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

// ⚡ Firebase Config (ambil dari projectmu)
const firebaseConfig = {
  apiKey: "AIzaSyAhKMFMm1zKbeWBnjsAyKe0ybOc43ZiybY",
  authDomain: "chat-global-74cdf.firebaseapp.com",
  projectId: "chat-global-74cdf",
  storageBucket: "chat-global-74cdf.appspot.com",
  messagingSenderId: "980925830481",
  appId: "1:980925830481:web:a19be163cff16dacc42f70",
  measurementId: "G-8MEB5XMGKV"
};

// 🚀 Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function askGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    const text = response.text || "No response from AI";

    // 💾 Simpan log ke Firebase
    await addDoc(collection(db, "logs"), {
      timestamp: Date.now(),
      prompt,
      response: text
    });

    return text;
  } catch (err) {
    console.error("❌ Error saat panggil Gemini AI:", err);

    // Simpan error ke log juga
    await addDoc(collection(db, "logs"), {
      timestamp: Date.now(),
      prompt,
      error: err.message
    });

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
Kamu adalah AI developer asisten.
Tugasmu: periksa kode berikut untuk bug HTML/JS, lalu buat versi perbaikan.
Jangan hapus fitur yang ada, tapi boleh tambah komentar jika perlu.
---
${code}
  `;

  const fixed = await askGemini(prompt);

  if (!fixed) {
    console.error("❌ AI tidak memberikan respons. Coba lagi nanti.");
    return;
  }

  // ✍️ Tulis hasil AI ke index.html
  fs.writeFileSync("index.html", fixed, "utf8");
  console.log("✅ index.html berhasil diperbarui oleh AI!");

  // 📌 Simpan hasil akhir ke Firestore
  await addDoc(collection(db, "results"), {
    timestamp: Date.now(),
    file: "index.html",
    content: fixed
  });
})();
