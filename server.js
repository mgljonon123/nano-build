import "dotenv/config";
import express from "express";
import multer from "multer";
import axios from "axios";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || "",
);

const app = express();
const upload = multer();
const PORT = process.env.PORT || 4000;
const N8N_AUTH_SIGNUP_URL = process.env.N8N_AUTH_SIGNUP_URL;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getN8nRequestConfig(baseConfig = {}) {
  const config = { ...baseConfig };
  const secret = process.env.N8N_JWT_SECRET;
  if (secret) {
    const token = jwt.sign({ service: "new8nntest-server" }, secret, {
      expiresIn: "1h",
    });
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
}

app.post("/api/stage-image", upload.single("photo"), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        details: "User must be logged in to use staging",
      });
    }
    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        error: "Unauthorized",
        details: authError?.message || "Invalid or expired token",
      });
    }

    const formFields = req.body || {};

    const config = getN8nRequestConfig({
      timeout: 60000,
      ...(authHeader && {
        headers: { "X-Original-Authorization": authHeader },
      }),
    });

    const payload = {
      ...formFields,
      user_email: user.email, // Add user's Gmail to the payload
      user_id: user.id, // Also include user ID for reference
    };
    if (req.file) {
      payload.photo = {
        name: req.file.originalname,
        type: req.file.mimetype,
        data: req.file.buffer.toString("base64"),
      };
    }

    const n8nRes = await axios.post(
      "https://psdagicilalalr.app.n8n.cloud/webhook-test/4800a196-c906-4278-8c52-ada7bb79f61e",
      payload,
      {
        ...config,
        headers: {
          ...config.headers,
          ...(token && { Authorization: `Bearer ${token}` }), // Add JWT token for N8N authentication
        },
      },
    );

    return res.json(n8nRes.data);
  } catch (err) {
    console.error("Staging error:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Failed to process",
      details: err?.response?.data || err.message,
    });
  }
});

app.post("/api/subscription", upload.none(), async (req, res) => {
  try {
    const subscriptionWebhookUrl =
      "https://psdagicilalalr.app.n8n.cloud/webhook-test/bb8e4aab-2a6a-40c4-9612-e34cb615622e";

    const payload = req.body || {};
    const authHeader = req.headers.authorization;

    // Extract user info if authenticated
    let user = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser(token);
      if (!authError && authUser) {
        user = authUser;
      }
    }

    const config = getN8nRequestConfig({
      timeout: 15000,
      ...(authHeader && {
        headers: { "X-Original-Authorization": authHeader },
      }),
    });

    // Add user info to payload if available
    const enhancedPayload = {
      ...payload,
      user_email: user?.email || null, // Add user's Gmail if authenticated
      user_id: user?.id || null, // Add user ID for reference
    };

    const n8nRes = await axios.post(
      subscriptionWebhookUrl,
      enhancedPayload,
      config,
    );
    return res.json(n8nRes.data);
  } catch (err) {
    console.error(
      "Subscription submission error:",
      err?.response?.data || err.message,
    );
    res.status(500).json({
      error: "Failed to send subscription",
      details: err?.response?.data || err.message,
    });
  }
});

app.post("/api/contact-subscription", upload.none(), async (req, res) => {
  try {
    const contactWebhookUrl =
      "https://psdagicilalalr.app.n8n.cloud/webhook-test/5d44674e-2088-44ce-be5c-685e9f78ff02";

    const payload = req.body || {};
    const authHeader = req.headers.authorization;
    let token = null;

    // Extract user info if authenticated
    let user = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser(token);
      if (!authError && authUser) {
        user = authUser;
      }
    }

    const config = getN8nRequestConfig({
      timeout: 15000,
      ...(authHeader && {
        headers: { "X-Original-Authorization": authHeader },
      }),
    });

    // Add user info to payload if available
    const enhancedPayload = {
      ...payload,
      user_email: user?.email || null, // Add user's Gmail if authenticated
      user_id: user?.id || null, // Add user ID for reference
    };

    const n8nRes = await axios.post(contactWebhookUrl, enhancedPayload, {
      ...config,
      headers: {
        ...config.headers,
        ...(token && { Authorization: `Bearer ${token}` }), // Add JWT token for N8N authentication
      },
    });
    return res.json(n8nRes.data);
  } catch (err) {
    console.error(
      "Contact submission error:",
      err?.response?.data || err.message,
    );
    res.status(500).json({
      error: "Failed to send message",
      details: err?.response?.data || err.message,
    });
  }
});

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
  process.exit(0);
});
