import "dotenv/config";
import express from "express";
import multer from "multer";
import axios from "axios";
import { InferenceClient } from "@huggingface/inference";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { buildStagingPrompt } from "./stagingPrompt.js";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";

const app = express();
const prisma = new PrismaClient();
const upload = multer();
const PORT = process.env.PORT || 4000;
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
const AI_MODE = (process.env.AI_MODE || "gemini").toLowerCase();
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const hfClient = HF_API_KEY ? new InferenceClient(HF_API_KEY) : null;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));

async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

function randomId() {
  return crypto.randomBytes(16).toString("hex");
}

function guessExt(mimeType) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

// --- CRUD: staging jobs (MongoDB via Prisma) ---
app.get("/api/staging-jobs", async (_req, res) => {
  try {
    const jobs = await prisma.stagingJob.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ jobs });
  } catch (err) {
    console.error("List staging jobs error:", err);
    res
      .status(500)
      .json({ error: "Failed to list staging jobs", details: err.message });
  }
});

app.get("/api/staging-jobs/:id", async (req, res) => {
  try {
    const job = await prisma.stagingJob.findUnique({
      where: { id: req.params.id },
    });
    if (!job) return res.status(404).json({ error: "Not found" });
    res.json({ job });
  } catch (err) {
    console.error("Get staging job error:", err);
    res
      .status(500)
      .json({ error: "Failed to get staging job", details: err.message });
  }
});

app.delete("/api/staging-jobs/:id", async (req, res) => {
  try {
    await prisma.stagingJob.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    // Prisma throws if record not found
    const isNotFound = String(err?.code || "").toUpperCase() === "P2025";
    if (isNotFound) return res.status(404).json({ error: "Not found" });
    console.error("Delete staging job error:", err);
    res
      .status(500)
      .json({ error: "Failed to delete staging job", details: err.message });
  }
});

app.post(
  "/api/stage-image",
  (req, res, next) => {
    upload.single("photo")(req, res, (multerErr) => {
      if (multerErr) {
        console.error("[stage-image] multer error:", multerErr);
        return res
          .status(400)
          .json({ error: "File upload failed", details: multerErr.message });
      }
      next();
    });
  },
  (req, res) => {
    const sendError = (status, error, details) => {
      console.error("[stage-image]", status, error, details);
      res.status(status).json({ error, details });
    };
    const run = async () => {
      if (!req.file) {
        return sendError(400, "photo file is required", null);
      }

      const formFields = req.body || {};
      const photoBuffer = req.file.buffer;
      const mimeType = req.file.mimetype;

      const { finalPrompt, roomType, action, styleDetecte } =
        buildStagingPrompt(formFields);

      await ensureUploadsDir();
      const originalExt = guessExt(mimeType);
      const originalFileName = `${Date.now()}_${randomId()}_original.${originalExt}`;
      await fs.writeFile(path.join(UPLOADS_DIR, originalFileName), photoBuffer);
      const originalUrl = `/uploads/${originalFileName}`;

      const saveJob = async (imageUrl) => {
        await prisma.stagingJob.create({
          data: {
            roomType,
            action,
            style: styleDetecte,
            imageUrl: imageUrl ?? null,
            finalPrompt,
          },
        });
      };

      // Free mode: skip external image generation, still save prompt + metadata
      if (AI_MODE === "prompt_only") {
        await saveJob(null);
        return res.status(200).json({
          finalPrompt,
          roomType,
          action,
          styleDetecte,
          imageUrl: null,
          originalUrl,
          note: "AI_MODE=prompt_only (no image generation; only prompt + original image are saved).",
        });
      }

      // Mock mode: treat the uploaded image as the "staged" result (no external AI)
      if (AI_MODE === "mock") {
        await saveJob(originalUrl);
        return res.status(200).json({
          finalPrompt,
          roomType,
          action,
          styleDetecte,
          imageUrl: originalUrl,
          originalUrl,
          note: "AI_MODE=mock (no external AI called, using uploaded image as result).",
        });
      }

      if (!HF_API_KEY) {
        return sendError(
          500,
          "HUGGING_FACE_API_KEY is not set in .env",
          "Create a token on Hugging Face and set HUGGING_FACE_API_KEY.",
        );
      }

      // Hugging Face text-to-image via official JS client (uses router API under the hood)
      // Use a model that has an available Inference Provider on hf-inference.
      const hfModel = "black-forest-labs/FLUX.1-schnell";
      if (!hfClient) {
        return sendError(
          500,
          "HF client not initialized",
          "Missing or invalid HUGGING_FACE_API_KEY.",
        );
      }

      const imageBlob = await hfClient.textToImage({
        provider: "hf-inference",
        model: hfModel,
        inputs: finalPrompt,
      });

      const arrayBuffer = await imageBlob.arrayBuffer();
      const outBuffer = Buffer.from(arrayBuffer);
      const outExt = "png";
      const outFileName = `${Date.now()}_${randomId()}_staged.${outExt}`;
      await fs.writeFile(path.join(UPLOADS_DIR, outFileName), outBuffer);
      const imageUrl = `/uploads/${outFileName}`;

      await saveJob(imageUrl);
      return res.json({
        finalPrompt,
        roomType,
        action,
        styleDetecte,
        imageUrl,
        originalUrl,
      });
    };
    run().catch((err) => {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = body?.error?.message || body?.message || err.message;
      const details =
        typeof body === "object" ? JSON.stringify(body) : body || err.message;
      console.error("HF staging error:", status, body || err);
      res.status(status || 500).json({
        error: "Error while generating staged image",
        details: message || details,
      });
    });
  },
);

// Ensure JSON on any unhandled error
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});

app.listen(PORT, () => {
  console.log(`Staging API listening on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  try {
    await prisma.$disconnect();
  } finally {
    process.exit(0);
  }
});
