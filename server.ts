import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI SDK with User-Agent requirement
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi di lingkungan server.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "SatuWarga.id",
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Gemini AI Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, enableThinking, contextData, systemRole } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Payload pesan tidak valid atau kosong." });
    }

    const ai = getAiClient();

    // Select Model based on request requirements
    // High thinking mode uses gemini-3.1-pro-preview with ThinkingLevel.HIGH
    // Standard mode uses gemini-3.6-flash for general fast tasks
    const modelName = enableThinking ? "gemini-3.1-pro-preview" : "gemini-3.6-flash";

    let roleInstruction =
      "Anda adalah Asisten Digital Cerdas AI Sukamaju ('SatuWarga Assistant'). Tugas Anda membantu warga dan pengurus RT/RW dalam memberikan informasi administrasi, layanan warga, kegiatan, kas keuangan, dan aturan kemasyarakatan di Indonesia secara ramah, sopan, ringkas, dan akurat.";

    if (systemRole === "LEGAL") {
      roleInstruction =
        "Anda adalah Asisten Legal & Draf Administrasi RT/RW Sukamaju. Anda ahli dalam membimbing warga serta menyusun draf pengumuman resmi, surat keputusan RT/RW, proposal kegiatan warga, dan regulasi ketertiban lingkungan sesuai aturan di Indonesia.";
    } else if (systemRole === "CREATIVE") {
      roleInstruction =
        "Anda adalah Inovator & Perencana Acara Warga Sukamaju. Anda bertugas memberikan ide-ide kreatif kegiatan warga (PKK, Karang Taruna, Posyandu, 17 Agustus), lomba warga, ide pengelolaan Bank Sampah, dan konsep kerja bakti lingkungan yang menyenangkan.";
    }

    let fullSystemInstruction = roleInstruction;
    if (contextData) {
      fullSystemInstruction += `\n\n--- KONTEKS DATA REAL LINGKUNGAN SUKAMAJU SAAT INI ---
(Gunakan data ini jika warga/pengurus menanyakan statistik atau kondisi wilayah):
- Total Warga Terdaftar: ${contextData.totalWarga ?? 0} Jiwa
- Saldo Kas RW: Rp ${(contextData.saldoKas ?? 0).toLocaleString("id-ID")}
- Total Aduan Warga: ${contextData.totalAduan ?? 0} (Belum Selesai / Pending: ${contextData.pendingAduan ?? 0})
- Total Pengumuman Aktif: ${contextData.totalPengumuman ?? 0}
- Total Kegiatan Terjadwal: ${contextData.totalKegiatan ?? 0}
- Total Barang Inventaris: ${contextData.totalBarang ?? 0} Unit`;
    }

    // Map conversation history into Gemini API format
    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const config: any = {
      systemInstruction: fullSystemInstruction,
    };

    if (enableThinking && modelName === "gemini-3.1-pro-preview") {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: formattedContents,
      config,
    });

    return res.json({
      text: response.text || "Maaf, AI tidak dapat menghasilkan tanggapan.",
      modelUsed: modelName,
      isThinking: Boolean(enableThinking),
    });
  } catch (err: any) {
    console.error("[Gemini Chat API Error]:", err);
    return res.status(500).json({
      error: err.message || "Terjadi kesalahan pada layanan AI Server.",
    });
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

