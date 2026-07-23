import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", appName: "SatuWarga.id", timestamp: new Date().toISOString() });
});

// AI Chat Assistant API
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY belum dikonfigurasi. Silakan atur di Secrets AI Studio.",
      });
    }

    const systemInstruction = `Anda adalah Asisten Digital SatuWarga.id (Community Operating System RT/RW/PKK/Karang Taruna/Posyandu/DKM/Linmas).
Tugas Anda adalah membantu pengurus lingkungan dalam menyusun dokumen administrasi, membalas pertanyaan warga, memberikan rekomendasi pengelolaan iuran/kegiatan, dan memberikan panduan prosedur lingkungan dengan bahasa Indonesia yang sopan, formal, dan jelas.
Context tambahan: ${context || "Aplikasi RT 01 / RW 05 Perumahan Graha Warga"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "Tidak ada respon dari AI." });
  } catch (err: any) {
    console.error("AI Chat Error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses permintaan AI" });
  }
});

// AI Draft Surat API
app.post("/api/ai/draft-surat", async (req, res) => {
  try {
    const { jenisSurat, namaWarga, nik, keperluan, dataTambahan } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(400).json({
        error: "GEMINI_API_KEY belum dikonfigurasi.",
      });
    }

    const prompt = `Buatkan konsep perihal, paragraf pembuka, dan isi Surat ${jenisSurat} resmi untuk:
Nama Warga: ${namaWarga}
NIK: ${nik}
Keperluan: ${keperluan}
Keterangan Tambahan: ${dataTambahan || "-"}

Format keluaran JSON yang rapi dengan properti:
1. perihal (string)
2. isiRingkas (string)
3. poinPenting (array string)
4. rekomendasiPengurus (string)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "Berikan jawaban dalam format JSON resmi administrasi RT/RW Indonesia.",
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ result: parsed });
  } catch (err: any) {
    console.error("AI Draft Surat Error:", err);
    res.status(500).json({ error: err.message || "Gagal membuat draft surat" });
  }
});

// AI Summarize Notulen API
app.post("/api/ai/summarize-notulen", async (req, res) => {
  try {
    const { agenda, pembahasanRaw, peserta } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(400).json({ error: "GEMINI_API_KEY belum dikonfigurasi." });
    }

    const prompt = `Ringkas notulensi rapat berikut menjadi poin-poin keputusan dan action items yang terstruktur:
Agenda: ${agenda}
Peserta: ${peserta}
Catatan Diskusi Mentah: ${pembahasanRaw}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "Buat ringkasan notulensi rapat profesional dengan keputusan utama, penanggung jawab, dan tenggat waktu.",
      },
    });

    res.json({ summary: response.text });
  } catch (err: any) {
    console.error("AI Summarize Notulen Error:", err);
    res.status(500).json({ error: err.message || "Gagal meringkas notulensi" });
  }
});

// AI Generate Proposal API
app.post("/api/ai/generate-proposal", async (req, res) => {
  try {
    const { namaKegiatan, estimasiAnggaran, sasaran, latarBelakang } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(400).json({ error: "GEMINI_API_KEY belum dikonfigurasi." });
    }

    const prompt = `Buatkan draf struktur Proposal Kegiatan Lingkungan:
Nama Kegiatan: ${namaKegiatan}
Estimasi Anggaran: Rp ${estimasiAnggaran}
Sasaran Peserta: ${sasaran}
Latar Belakang Singkat: ${latarBelakang}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "Susun proposal kegiatan kemasyarakatan yang terstruktur meliputi Latar Belakang, Tujuan, Susunan Panitia, Rencana Anggaran Biaya (RAB), dan Penutup.",
      },
    });

    res.json({ proposalText: response.text });
  } catch (err: any) {
    console.error("AI Generate Proposal Error:", err);
    res.status(500).json({ error: err.message || "Gagal membuat proposal" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SatuWarga.id] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
