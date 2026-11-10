export function pdfFileName(name: string) {
  const clean = name.trim().replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "Applicant";
  return `Republic_Hall_Fellow_Application_${clean}.pdf`;
}
export function formatLetterDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
