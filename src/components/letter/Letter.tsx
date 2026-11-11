import { forwardRef } from "react";
import logoAsset from "@/assets/republic-hall-logo.png.asset.json";

export type LetterData = { name: string; dept: string; phone: string; email: string; date: string; signature: string | null };

const ph = (v: string, p: string) => v.trim() || <span className="text-muted-foreground">{p}</span>;

export const Letter = forwardRef<HTMLDivElement, { d: LetterData }>(({ d }, ref) => (
  <div id="letter" ref={ref} className="flex flex-col bg-paper font-serif text-foreground" style={{ width: "210mm", height: "297mm", padding: "20mm 22mm" }}>
    <header className="text-center">
      <div className="mb-3 flex justify-center">
        <img src={logoAsset.url} alt="Republic Hall, KNUST crest" className="h-24 w-auto object-contain" />
      </div>
      <p className="text-[13pt] font-bold tracking-wide">Republic hall fellow application portal</p>
      <p className="mt-1 text-[11pt] font-bold tracking-wider text-primary">OFFICE OF THE HALL COUNCIL — REPUBLIC HALL</p>
      <div className="rule-crest mt-4" />
    </header>
    <section className="mt-8 space-y-1.5 text-[10.5pt] leading-relaxed">
      <p><b>Date:</b> {d.date}</p>
      <p><b>To:</b> The Chairman, Hall Council, Republic Hall, KNUST, Kumasi</p>
      <p><b>From:</b> {ph(d.name, "[Full Name & Title]")}, {ph(d.dept, "[Department]")}</p>
      <p><b>Subject:</b> <b className="underline">APPLICATION FOR APPOINTMENT AS HALL FELLOW</b></p>
    </section>
    <hr className="my-6 border-border" />
    <p className="text-justify text-[10.5pt] leading-[1.9]">
      I write to formally express my strong interest in serving as a Hall Fellow for Republic Hall, bringing a deep commitment to student mentorship, academic excellence, and holistic campus development to the Hall’s administration. Having closely supported student life within the university community, I am well-equipped to mediate student concerns, maintain disciplinary standards, and act as a reliable bridge between Hall Management and residents. If given the opportunity, I will collaborate effectively with the Hall Master, Senior Tutor, and student leaders to uphold the proud traditions and unity of Republic Hall, and I look forward to discussing my suitability in an interview.
    </p>
    <div className="mt-10 text-[10.5pt] leading-relaxed">
      <p className="font-bold">Yours faithfully,</p>
      <div className="my-2 flex h-[65px] w-[180px] items-end">
        {d.signature ? <img src={d.signature} alt="Signature" className="max-h-[65px] max-w-[180px] object-contain" /> : <span className="w-full border-b border-dashed border-muted-foreground" />}
      </div>
      <p className="font-bold">{ph(d.name, "[Full Name & Title]")}</p>
      <p>{ph(d.dept, "[Department]")}, KNUST</p>
      <p>Contact: {ph(d.phone, "[Phone Number]")}{d.email.trim() && ` / ${d.email.trim()}`}</p>
    </div>
  </div>
));
Letter.displayName = "Letter";
