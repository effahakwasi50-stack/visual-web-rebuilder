import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Loader2, Printer, Upload, Eraser, CheckCircle2 } from "lucide-react";
import { Letter } from "@/components/letter/Letter";
import { SignaturePad } from "@/components/letter/SignaturePad";
import { pdfFileName, formatLetterDate } from "@/lib/letter";
import logoAsset from "@/assets/republic-hall-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hall Fellow Application Letter — Republic Hall, KNUST" },
      { name: "description", content: "Fill in, sign and download an official Republic Hall Fellow application letter as a PDF." },
      { property: "og:title", content: "Hall Fellow Application Letter — Republic Hall, KNUST" },
      { property: "og:description", content: "Fill in, sign and download an official Republic Hall Fellow application letter as a PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const readFile = (f: File) => new Promise<string>((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result as string); fr.readAsDataURL(f); });
const field = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40";

function Index() {
  const [name, setName] = useState(""); const [dept, setDept] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [tab, setTab] = useState<"draw" | "upload">("draw"); const [ink, setInk] = useState<"--ink-blue" | "--ink-black">("--ink-blue");
  const [drawn, setDrawn] = useState<string | null>(null); const [uploaded, setUploaded] = useState<string | null>(null); const [clearKey, setClearKey] = useState(0);
  const [busy, setBusy] = useState(false); const [scale, setScale] = useState(1);
  const letterRef = useRef<HTMLDivElement>(null); const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setDate(new Date().toISOString().slice(0, 10)); }, []);
  useEffect(() => {
    const el = wrapRef.current; if (!el) return; const ro = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / 794))); ro.observe(el); return () => ro.disconnect();
  }, []);

  const signature = tab === "draw" ? drawn : uploaded;
  const done = [name, dept, phone].filter((v) => v.trim()).length + (signature ? 1 : 0);
  const ready = done === 4;
  const d = { name, dept, phone, email, date: date ? formatLetterDate(date) : "", signature };

  async function download() {
    if (!ready || !letterRef.current) return; setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
      await document.fonts.ready;
      const canvas = await html2canvas(letterRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        width: letterRef.current.offsetWidth,
        height: letterRef.current.offsetHeight,
        windowWidth: 1280,
        onclone: (doc) => {
          const letter = doc.getElementById("letter");
          if (!letter) return;
          // Preview scaling must not affect the text measurements used for PDF capture.
          let ancestor = letter.parentElement;
          while (ancestor) {
            ancestor.style.transform = "none";
            ancestor.style.overflow = "visible";
            ancestor = ancestor.parentElement;
          }
          letter.style.transform = "none";
        },
      });
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
      pdf.save(pdfFileName(name));
      toast.success("Application PDF Downloaded Successfully!");
    } catch (e) { console.error(e); toast.error("Could not generate the PDF. Please try again."); }
    finally { setBusy(false); }
  }

  const DownloadBar = () => (
    <div className="flex flex-wrap items-center gap-3">
      <span title={ready ? "" : "Complete Full Name, Department, Phone Number and Signature first"} className="flex-1">
        <button onClick={download} disabled={!ready || busy}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-crest px-5 py-3 text-sm font-semibold text-primary-foreground ring-2 ring-accent transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? <><Loader2 className="size-4 animate-spin" /> Generating Official PDF...</> : <><Download className="size-4" /> Download Completed Application (PDF)</>}
        </button>
      </span>
      <button onClick={() => window.print()} className="flex items-center gap-2 rounded-md border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-secondary">
        <Printer className="size-4" /> Print / Save as PDF
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="bg-crest text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-5">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-card p-1 shadow-sm">
            <img src={logoAsset.url} alt="" className="size-full object-contain" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Republic Hall · KNUST</p>
            <h1 className="font-serif text-xl font-bold md:text-2xl">Hall Fellow Application Letter</h1>
          </div>
        </div>
        <div className="rule-crest" />
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <section className="h-fit rounded-xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-6">
          <div className="mb-5">
            <div className="mb-1 flex justify-between text-xs font-medium">
              <span className="flex items-center gap-1">{ready && <CheckCircle2 className="size-3.5 text-primary" />}{done} of 4 required fields completed</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-accent transition-all" style={{ width: `${done * 25}%` }} /></div>
          </div>
          <div className="space-y-4">
            <L label="Full Name & Academic Title *"><input className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Kwame Mensah, Senior Lecturer" /></L>
            <L label="Department *"><input className={field} value={dept} onChange={(e) => setDept(e.target.value)} placeholder="Department of Petroleum Engineering" /></L>
            <div className="grid gap-4 sm:grid-cols-2">
              <L label="Phone Number *"><input type="tel" className={field} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0593602676" /></L>
              <L label="Application Date"><input type="date" className={field} value={date} onChange={(e) => setDate(e.target.value)} /></L>
            </div>
            <L label="Email (optional)"><input type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kmensah@knust.edu.gh" /></L>
            <div>
              <p className="mb-1.5 text-sm font-medium">Electronic Signature *</p>
              <div className="mb-3 grid grid-cols-2 rounded-md bg-muted p-1 text-sm">
                {(["draw", "upload"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={`rounded px-3 py-1.5 font-medium ${tab === t ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
                    {t === "draw" ? "Draw Signature" : "Upload Signature"}
                  </button>
                ))}
              </div>
              <div className={tab === "draw" ? "" : "hidden"}>
                <SignaturePad color={ink} onChange={setDrawn} clearKey={clearKey} />
                <div className="mt-2 flex items-center justify-between text-xs">
                  <div className="flex gap-2">
                    {([["--ink-blue", "Blue Ink", "bg-ink-blue"], ["--ink-black", "Black Ink", "bg-ink-black"]] as const).map(([v, l, c]) => (
                      <button key={v} onClick={() => setInk(v)} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${ink === v ? "border-primary" : "border-border"}`}>
                        <span className={`size-3 rounded-full ${c}`} />{l}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setClearKey((k) => k + 1)} className="flex items-center gap-1 text-muted-foreground hover:text-primary"><Eraser className="size-3.5" /> Clear Signature</button>
                </div>
              </div>
              {tab === "upload" && (
                <div className="flex items-center gap-3">
                  <FileBtn label="Choose Signature Image" onFile={async (f) => setUploaded(await readFile(f))} />
                  {uploaded && <img src={uploaded} alt="" className="h-10 object-contain" />}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="min-w-0 space-y-5">
          <DownloadBar />
          <div ref={wrapRef} className="w-full">
            <div className="mx-auto overflow-hidden" style={{ width: 794 * scale, height: 1123 * scale }}>
              <div className="shadow-paper origin-top-left" style={{ transform: `scale(${scale})`, width: 794 }}>
                <Letter ref={letterRef} d={d} />
              </div>
            </div>
          </div>
          <DownloadBar />
        </section>
      </main>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium">{label}</span>{children}</label>;
}
function FileBtn({ label, onFile }: { label: string; onFile: (f: File) => void }) {
  return (
    <span className="relative inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:border-accent">
      <Upload className="size-4" /> {label}
      <input type="file" accept="image/png,image/jpeg" className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
    </span>
  );
}
