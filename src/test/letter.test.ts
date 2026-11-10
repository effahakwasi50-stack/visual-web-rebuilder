import { describe, it, expect } from "vitest";
import { pdfFileName, formatLetterDate } from "@/lib/letter";
describe("letter", () => {
  it("names the PDF after the applicant", () => expect(pdfFileName("Dr. Kwame Mensah, Senior Lecturer")).toBe("Republic_Hall_Fellow_Application_Dr_Kwame_Mensah_Senior_Lecturer.pdf"));
  it("formats dates formally", () => expect(formatLetterDate("2026-11-10")).toBe("November 10, 2026"));
});
