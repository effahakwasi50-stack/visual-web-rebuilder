import { forwardRef } from "react";

export type LetterData = { name: string; dept: string; phone: string; email: string; date: string; signature: string | null };

const ph = (v: string, p: string) => v.trim() || <span className="text-muted-foreground">{p}</span>;

export const Letter = forwardRef<HTMLDivElement, { d: LetterData }>(({ d }, ref) => (
  <div id="letter" ref={ref} className="flex flex-col bg-paper font-letter text-ink-black tracking-normal" style={{ width: "210mm", height: "297mm", padding: "18mm 22mm" }}>
    <section className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[10.5pt] leading-[1.6]">
      <b>Date:</b><p>{d.date}</p>
      <b>To:</b><p>Hall Warden, Republic Hall</p>
      <b>From:</b><p className="break-words">{ph(d.name, "[Full Name & Title]")}<br />{ph(d.dept, "[Department]")}, KNUST</p>
    </section>
    <div className="mt-6 space-y-4 text-[10.5pt] leading-[1.7]">
      <p>Dear Sir,</p>
      <p className="font-bold underline underline-offset-4">APPLICATION FOR APPOINTMENT AS HALL FELLOW</p>
      <div className="space-y-4 text-left">
        <p>I write to express my interest in appointment as a Hall Fellow of Republic Hall. I am committed to student mentorship, academic excellence, and the holistic development of students within the university community.</p>
        <p>If appointed, I would support Hall Management in addressing student concerns, upholding disciplinary standards, and fostering a respectful and inclusive residential environment. I would work closely with the Hall Master, Senior Tutor, and student leaders to promote the welfare of residents and uphold the proud traditions and unity of Republic Hall.</p>
        <p>I would welcome the opportunity to discuss my suitability for this role in an interview. Thank you for considering my application.</p>
      </div>
    </div>
    <div className="mt-6 text-[10.5pt] leading-[1.6]">
      <p>Yours faithfully,</p>
      <div className="my-2 flex h-[56px] w-[180px] items-center">
        {d.signature ? <img src={d.signature} alt="Signature" className="max-h-[56px] max-w-[180px] object-contain" /> : <span className="w-full border-b border-dashed border-muted-foreground" />}
      </div>
      <p className="break-words font-bold">{ph(d.name, "[Full Name & Title]")}</p>
      <p className="break-words">{ph(d.dept, "[Department]")}, KNUST</p>
      <p className="mt-1 break-words text-[9.5pt]">Tel: {ph(d.phone, "[Phone Number]")}</p>
      {d.email.trim() && <p className="break-words text-[9.5pt]">Email: {d.email.trim()}</p>}
    </div>
  </div>
));
Letter.displayName = "Letter";
