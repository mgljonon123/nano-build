import React, { useEffect, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface StagingResponse {
  finalPrompt: string;
  roomType: string;
  action: string;
  styleDetecte: string;
  imageUrl?: string;
  originalUrl?: string;
  note?: string;
}

type StagingJob = {
  id: string;
  roomType: string;
  action: string;
  style: string;
  imageUrl: string | null;
  finalPrompt: string;
  createdAt: string;
};

export default function Staging() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StagingResponse | null>(null);
  const [jobs, setJobs] = useState<StagingJob[]>([]);
  const [jobsError, setJobsError] = useState<string | null>(null);

  async function loadJobs() {
    try {
      setJobsError(null);
      const res = await fetch("/api/staging-jobs");
      const raw = await res.text();
      let json: { jobs?: StagingJob[]; error?: string; details?: string } = {};
      try {
        json = JSON.parse(raw) as { jobs?: StagingJob[]; error?: string; details?: string };
      } catch {
        // When the backend isn't running (or proxy misconfigured), Vite returns an HTML 404 page.
        if (!res.ok) {
          throw new Error(
            "API not found. Start the backend with: npm run server (port 4000)."
          );
        }
      }

      if (!res.ok) {
        throw new Error(json.details || json.error || "Failed to load jobs");
      }

      setJobs(Array.isArray(json.jobs) ? json.jobs : []);
    } catch (e) {
      console.error(e);
      setJobsError(e instanceof Error ? e.message : "Failed to load jobs");
      setJobs([]);
    }
  }

  useEffect(() => {
    void loadJobs();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/stage-image", {
        method: "POST",
        body: formData,
      });

      const raw = await response.text();
      let data: StagingResponse | { error?: string; details?: string } = {};
      try {
        data = JSON.parse(raw) as { error?: string; details?: string };
      } catch {
        // Server returned non-JSON (e.g. HTML error page)
        if (!response.ok) {
          throw new Error(
            "Server error. Make sure the API is running: npm run server (port 4000)."
          );
        }
      }

      if (!response.ok) {
        const msg =
          (data.details ?? data.error) ||
          "Failed to generate staging image. Check the terminal where you ran npm run server for details.";
        throw new Error(msg);
      }

      setResult(data as StagingResponse);
      setStatus("success");
      void loadJobs();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  async function deleteJob(id: string) {
    try {
      const res = await fetch(`/api/staging-jobs/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const raw = await res.text();
        let msg = "Failed to delete";
        try {
          const json = JSON.parse(raw) as { error?: string; details?: string };
          msg = json.details || json.error || msg;
        } catch {}
        throw new Error(msg);
      }
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (e) {
      console.error(e);
      setJobsError(e instanceof Error ? e.message : "Failed to delete job");
    }
  }

  return (
    <div className="py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl font-semibold text-[var(--color-stone)] mb-3">
          AI Home Staging
        </h1>
        <p className="text-[var(--color-stone)]/80 mb-8">
          Upload a photo of your room and generate a staged version with virtual
          furniture and decor.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6 bg-white rounded-xl border border-[var(--color-warm-light)]/30"
        >
          <div>
            <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">
              What do you want to do?
            </label>
            <select
              name="What do you want to do?"
              className="w-full rounded-lg border border-[var(--color-warm-light)]/60 px-3 py-2 text-[var(--color-stone)] focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)]"
              required
              defaultValue="Furnish (Staging)"
            >
              <option value="Furnish (Staging)">Furnish (Staging)</option>
              <option value="Empty the room">Empty the room</option>
              <option value="Clean the room">Clean the room</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">
              What is this room?
            </label>
            <select
              name="room"
              className="w-full rounded-lg border border-[var(--color-warm-light)]/60 px-3 py-2 text-[var(--color-stone)] focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)]"
              required
              defaultValue="LIVING ROOM"
            >
              <option value="LIVING ROOM">Living room</option>
              <option value="KITCHEN">Kitchen</option>
              <option value="BEDROOM">Bedroom</option>
              <option value="KIDS ROOM">Kids room</option>
              <option value="BALCONY">Balcony</option>
              <option value="OFFICE">Office</option>
              <option value="BATHROOM">Bathroom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">
              Which style / brand do you want?
            </label>
            <select
              name="style"
              className="w-full rounded-lg border border-[var(--color-warm-light)]/60 px-3 py-2 text-[var(--color-stone)] focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)]"
              required
            >
              <option value="Modern">Modern</option>
              <option value="Modern Luxe">Modern Luxe</option>
              <option value="Ultra Luxury">Ultra Luxury</option>
              <option value="Scandinavian">Scandinavian</option>
              <option value="Industrial">Industrial</option>
              <option value="Bulthaup (Kitchen)">Bulthaup (Kitchen)</option>
              <option value="Boffi (Kitchen)">Boffi (Kitchen)</option>
              <option value="Vitra (Living Room/Office)">
                Vitra (Living Room/Office)
              </option>
              <option value="BoConcept (Living Room/Bedroom)">
                BoConcept (Living Room/Bedroom)
              </option>
              <option value="Roche Bobois (Bedroom/Living Room)">
                Roche Bobois (Bedroom/Living Room)
              </option>
              <option value="WABI-SABI (Bedroom/Living Room)">
                WABI-SABI (Bedroom/Living Room)
              </option>
              <option value="MID-CENTURY Modern (Office/Living Room)">
                MID-CENTURY Modern (Office/Living Room)
              </option>
              <option value="Parisian Chic / Haussmannien (Living Room/Bedroom)">
                Parisian Chic / Haussmannien (Living Room/Bedroom)
              </option>
              <option value="ART DECO (Luxury Living Room)">
                ART DECO (Luxury Living Room)
              </option>
              <option value="MINOTTI / B&B ITALIA (Living Room)">
                MINOTTI / B&amp;B ITALIA (Living Room)
              </option>
              <option value="KNOLL / CASSINA (Office / Living Room)">
                KNOLL / CASSINA (Office / Living Room)
              </option>
              <option value="HERMAN MILLER (Office)">
                HERMAN MILLER (Office)
              </option>
              <option value="POLIFORM (Kitchen / Closet)">
                POLIFORM (Kitchen / Closet)
              </option>
              <option value="Arthur Bonnet (Kitchen)">
                Arthur Bonnet (Kitchen)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-stone)] mb-1">
              Upload your photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              required
              className="block w-full text-sm text-[var(--color-stone)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[var(--color-stone)] file:text-[var(--color-sand)] hover:file:bg-[var(--color-warm)]"
            />
            <p className="mt-1 text-xs text-[var(--color-stone)]/60">
              Use a clear, well‑lit photo of the room you want to stage.
            </p>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 bg-[var(--color-stone)] text-[var(--color-sand)] font-medium rounded-lg hover:bg-[var(--color-warm)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "loading"
              ? "Generating staging…"
              : "Generate staged image"}
          </button>

          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </form>

        {result && (
          <div className="mt-10 space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[var(--color-stone)]">
              Result
            </h2>
            <p className="text-sm text-[var(--color-stone)]/70">
              Action: {result.action} • Room: {result.roomType} • Style:{" "}
              {result.styleDetecte}
            </p>
            {result.imageUrl ? (
              <div className="aspect-[4/3] max-w-2xl rounded-xl overflow-hidden bg-[var(--color-stone)]/5">
                <img
                  src={result.imageUrl}
                  alt="AI staged room"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : result.originalUrl ? (
              <div className="space-y-2">
                {result.note && (
                  <p className="text-sm text-[var(--color-stone)]/70">
                    {result.note}
                  </p>
                )}
                <div className="aspect-[4/3] max-w-2xl rounded-xl overflow-hidden bg-[var(--color-stone)]/5">
                  <img
                    src={result.originalUrl}
                    alt="Original uploaded room"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-[var(--color-stone)]/70">
                  Image generation is currently disabled, but your upload and prompt were saved.
                </p>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-stone)]/70">
                The backend did not return an image URL. Check your Node.js API
                implementation.
              </p>
            )}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-[var(--color-warm)]">
                Show advanced AI prompt
              </summary>
              <pre className="mt-2 p-4 bg-[var(--color-stone)]/5 rounded-lg text-xs text-[var(--color-stone)] whitespace-pre-wrap">
                {result.finalPrompt}
              </pre>
            </details>
          </div>
        )}

        <div className="mt-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-2xl font-semibold text-[var(--color-stone)]">
              History
            </h2>
            <button
              type="button"
              onClick={() => void loadJobs()}
              className="text-sm text-[var(--color-warm)] hover:underline"
            >
              Refresh
            </button>
          </div>

          {jobsError && <p className="text-sm text-red-600 mb-4">{jobsError}</p>}

          {jobs.length === 0 ? (
            <p className="text-sm text-[var(--color-stone)]/70">
              No staging jobs yet. Generate your first one above.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-white rounded-xl border border-[var(--color-warm-light)]/30"
                >
                  <p className="text-xs text-[var(--color-stone)]/60">
                    {new Date(job.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-stone)]/80">
                    {job.action} • {job.roomType} • {job.style}
                  </p>

                  {job.imageUrl ? (
                    <div className="mt-3 aspect-[4/3] rounded-lg overflow-hidden bg-[var(--color-stone)]/5">
                      <img
                        src={job.imageUrl}
                        alt="Staged result"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-[var(--color-stone)]/70">
                      No image returned for this job.
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <details>
                      <summary className="cursor-pointer text-xs text-[var(--color-warm)]">
                        Prompt
                      </summary>
                      <pre className="mt-2 p-3 bg-[var(--color-stone)]/5 rounded-lg text-[10px] text-[var(--color-stone)] whitespace-pre-wrap max-h-48 overflow-auto">
                        {job.finalPrompt}
                      </pre>
                    </details>
                    <button
                      type="button"
                      onClick={() => void deleteJob(job.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
