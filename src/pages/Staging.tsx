import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "w-full appearance-none rounded-2xl border border-white/40 bg-white/60 px-5 py-3.5 text-sm font-medium text-[var(--color-stone)] shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] backdrop-blur-md transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]/40 focus:bg-white hover:bg-white/80";

const labelClass = "block text-xs font-bold uppercase tracking-wider text-[var(--color-forest)]/80 mb-2 ml-1";

export default function Staging() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [actionType, setActionType] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    setResult(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const { data: authData } = await supabase.auth.getSession();
      const token = authData.session?.access_token;

      const response = await fetch("/api/stage-image", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();

      console.log("✅ N8N Response:", data);

      setResult(Array.isArray(data) ? data[0] : data);
      setStatus("success");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="font-marketing flex-1 w-full relative bg-[var(--color-sand)] bg-[radial-gradient(ellipse_at_top,_var(--color-sand)_0%,_#EAE3D9_100%)] text-[var(--color-stone)] flex flex-col min-h-0 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-orange-100/40 blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-forest)]/5 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col justify-center py-4 lg:py-8 min-h-0 max-h-full">
        
        <div className="text-center md:text-left mb-4 lg:mb-6 animate-slide-up shrink-0">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest text-[var(--color-forest)] uppercase mb-2 px-3 py-1 rounded-full bg-[var(--color-forest)]/5 border border-[var(--color-forest)]/10 shadow-sm">
            <SparklesIcon className="w-4 h-4" /> AI Home Staging
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight font-medium leading-[1.1]">
            Bring empty rooms  
            <span className=" italic">to life.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch flex-1 min-h-0 w-full overflow-y-auto lg:overflow-visible pb-12 lg:pb-0 px-1 -mx-1">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-5 relative z-10 animate-slide-up delay-100 flex flex-col min-h-0">
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-[2rem] p-5 sm:p-6 lg:p-7 space-y-4 lg:space-y-5 flex flex-col justify-center min-h-0"
            >
              <div>
                <label className={labelClass}>
                  What do you want to do?
                </label>
                <div className="relative">
                  <select
                    name="What do you want to do?"
                    className={fieldClass}
                    required
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                  >
                    <option value="" disabled>Select an option...</option>
                    <option value="Furnish (Staging)">Furnish (Staging)</option>
                    <option value="Empty the room">Empty the room</option>
                    <option value="Clean the room">Clean the room</option>
                  </select>
                  <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Upload your photo</label>
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[var(--color-forest)]/20 rounded-2xl cursor-pointer bg-white/40 hover:bg-white/70 transition-all group shadow-inner">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-3 bg-[var(--color-forest)]/5 rounded-full mb-3 group-hover:scale-110 transition-transform">
                       <UploadIcon className="w-6 h-6 text-[var(--color-forest)] opacity-80" />
                    </div>
                    {fileName ? (
                      <p className="text-sm font-medium text-[var(--color-forest)] truncate max-w-[200px]">{fileName}</p>
                    ) : (
                      <>
                        <p className="mb-1 text-sm text-[var(--color-stone)]"><span className="font-semibold text-[var(--color-forest)]">Click to upload</span></p>
                        <p className="text-xs text-[var(--color-muted)]">Clear, well‑lit photos work best</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    name="photo" 
                    accept="image/*" 
                    required 
                    className="hidden" 
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                  />
                </label>
              </div>

              {actionType !== "Empty the room" && actionType !== "Clean the room" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className={labelClass}>What is this room?</label>
                    <div className="relative">
                      <select name="room" className={fieldClass} required defaultValue="">
                        <option value="" disabled>Select an option...</option>
                        <option value="LIVING ROOM">LIVING ROOM</option>
                        <option value="KITCHEN">KITCHEN</option>
                        <option value="BEDROOM">BEDROOM</option>
                        <option value="KIDS ROOM">KIDS ROOM</option>
                        <option value="BALCONY">BALCONY</option>
                        <option value="OFFICE">OFFICE</option>
                        <option value="BATHROOM">BATHROOM</option>
                      </select>
                      <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Which style / brand do you want?</label>
                    <div className="relative">
                      <select name="style" className={fieldClass} required defaultValue="">
                        <option value="" disabled>Select an option...</option>
                        <option value="Modern">Modern</option>
                        <option value="Modern Luxe">Modern Luxe</option>
                        <option value="Ultra Luxury">Ultra Luxury</option>
                        <option value="Scandinavian">Scandinavian</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Bulthaup (Kitchen)">Bulthaup (Kitchen)</option>
                        <option value="Boffi (Kitchen)">Boffi (Kitchen)</option>
                        <option value="Vitra (Living Room/Office)">Vitra (Living Room/Office)</option>
                        <option value="BoConcept (Living Room/Bedroom)">BoConcept (Living Room/Bedroom)</option>
                        <option value="Roche Bobois (Bedroom/Living Room)">Roche Bobois (Bedroom/Living Room)</option>
                        <option value="WABI-SABI (Bedroom/Living Room)">WABI-SABI (Bedroom/Living Room)</option>
                        <option value="MID-CENTURY Modern (Office/Living Room)">MID-CENTURY Modern (Office/Living Room)</option>
                        <option value="Parisian Chic / Haussmannien (Living Room/Bedroom)">Parisian Chic / Haussmannien (Living Room/Bedroom)</option>
                        <option value="ART DECO (Luxury Living Room)">ART DECO (Luxury Living Room)</option>
                        <option value="MINOTTI / B&B ITALIA (Living Room)">MINOTTI / B&amp;B ITALIA (Living Room)</option>
                        <option value="KNOLL / CASSINA (Office / Living Room)">KNOLL / CASSINA (Office / Living Room)</option>
                        <option value="HERMAN MILLER (Office)">HERMAN MILLER (Office)</option>
                        <option value="POLIFORM (Kitchen / Closet)">POLIFORM (Kitchen / Closet)</option>
                        <option value="Arthur Bonnet (Kitchen)">Arthur Bonnet (Kitchen)</option>
                      </select>
                      <ChevronIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-2xl bg-[var(--color-forest)] text-white text-[15px] font-medium shadow-[0_8px_20px_rgba(27,67,50,0.2)] hover:shadow-[0_12px_25px_rgba(27,67,50,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-4"
              >
                {status === "loading" ? (
                  <>
                    <LoadingSpinner /> Generating Magic...
                  </>
                ) : (
                  <>
                    Generate Staged Image <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50/80 backdrop-blur border border-red-100 rounded-xl text-sm text-red-700 animate-fade-in flex items-start gap-3">
                  <ErrorIcon className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                  <p>{error}</p>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Result / Placeholder */}
          <div className="lg:col-span-7 h-full lg:min-h-0 flex flex-col animate-slide-up delay-200 mt-6 lg:mt-0 max-h-[80vh] lg:max-h-full">
            {status === "success" && result && (result.imageUrl || result.viewUrl) ? (
              <div className="h-full flex flex-col justify-center animate-fade-in w-full">
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/50 bg-white p-2 flex-grow flex flex-col">
                  <div className="rounded-2xl overflow-hidden relative flex-grow flex items-center justify-center bg-gray-50/50">
                    <img
                      src={result.fileId ? `https://drive.google.com/thumbnail?id=${result.fileId}&sz=w2000` : (result.imageUrl || result.viewUrl)}
                      alt="AI Staged Room"
                      className="max-w-full max-h-[50vh] object-contain rounded-2xl"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        console.error("Image failed to load");
                        e.currentTarget.src = "/placeholder-image.jpg"; 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                       <a
                          href={result.imageUrl || result.viewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-6 py-3 bg-white/90 backdrop-blur text-[var(--color-stone)] rounded-full text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
                        >
                          <DownloadIcon className="w-4 h-4" /> Download High-Res
                        </a>
                    </div>
                  </div>
                </div>
                
                {result.viewUrl && (
                  <div className="mt-6 flex justify-center">
                    <a
                      href={result.viewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-[var(--color-forest)] hover:text-[var(--color-forest-hover)] flex items-center gap-1.5 underline underline-offset-4 decoration-[var(--color-forest)]/30 hover:decoration-[var(--color-forest)] transition-all"
                    >
                      <LinkIcon className="w-4 h-4" /> View Original in Google Drive
                    </a>
                  </div>
                )}
              </div>
            ) : status === "loading" ? (
               <div className="h-full min-h-[400px] rounded-3xl border border-[var(--color-forest)]/10 bg-white/40 glass-card flex items-center justify-center pulse-glow">
                  <div className="flex flex-col items-center text-center opacity-80">
                     <LoadingSpinner className="w-12 h-12 text-[var(--color-forest)] mb-4" />
                     <h3 className="text-lg font-display text-[var(--color-stone)] mb-2">Analyzing space...</h3>
                     <p className="text-sm text-[var(--color-muted)] max-w-[250px]">Our AI is processing your request and staging your room.</p>
                  </div>
               </div>
             ) : (
              <div className="h-full rounded-3xl border border-dashed border-gray-300/80 bg-white/30 glass-card flex-1 flex items-center justify-center opacity-70 min-h-[300px] lg:min-h-0">
                <div className="flex flex-col items-center text-center p-8">
                  <div className="w-20 h-20 mb-6 rounded-full bg-[var(--color-forest)]/5 flex items-center justify-center text-[var(--color-forest)]/40">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-display text-[var(--color-stone)] mb-2">Awaiting your vision</h3>
                  <p className="text-sm text-[var(--color-muted)] max-w-[280px]">
                    Upload a photo and configure the settings. Your beautifully staged room will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Icons ---

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.748 3.748 0 0 1 18 19.5H6.75Z" />
    </svg>
  );
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  );
}

function LoadingSpinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg className={`animate-spin h-5 w-5 ${props.className || ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function ErrorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
