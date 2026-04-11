const DEFAULT_N8N_STAGING_WEBHOOK =
  "https://psdagicilalalr.app.n8n.cloud/webhook-test/4800a196-c906-4278-8c52-ada7bb79f61e";

export type StagingWebhookPayload = {
  /** "Furnish (Staging)" | "Empty the room" | "Clean the room" */
  action: string;
  room: string;
  style: string;
  photoFileName: string | null;
  /** ISO-8601 */
  submittedAt: string;
  source: "staging-form";
};

function webhookUrl(): string {
  const fromEnv = import.meta.env.VITE_N8N_STAGING_WEBHOOK_URL as
    | string
    | undefined;
  const trimmed = fromEnv?.trim();
  return trimmed || DEFAULT_N8N_STAGING_WEBHOOK;
}

/**
 * POSTs staging form selections to n8n. Does not throw (logs on failure)
 * so the main staging flow can continue even if the webhook errors.
 */
export async function notifyN8nStagingSelections(
  payload: Omit<StagingWebhookPayload, "submittedAt" | "source"> & {
    submittedAt?: string;
  },
): Promise<void> {
  const body: StagingWebhookPayload = {
    source: "staging-form",
    action: payload.action,
    room: payload.room,
    style: payload.style,
    photoFileName: payload.photoFileName,
    submittedAt: payload.submittedAt ?? new Date().toISOString(),
  };

  try {
    const res = await fetch(webhookUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn(
        "[n8n webhook] Non-OK response",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (e) {
    console.warn("[n8n webhook] Request failed", e);
  }
}
