import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Letter } from "@/components/letter/Letter";
import logoAsset from "@/assets/republic-hall-logo.png.asset.json";
import { pdfFileName, formatLetterDate } from "@/lib/letter";

describe("letter", () => {
  it("names the PDF after the applicant", () => expect(pdfFileName("Dr. Kwame Mensah, Senior Lecturer")).toBe("Republic_Hall_Fellow_Application_Dr_Kwame_Mensah_Senior_Lecturer.pdf"));
  it("formats dates formally", () => expect(formatLetterDate("2026-11-10")).toBe("November 10, 2026"));
  it("always prints the official Republic Hall crest", () => {
    render(
      <Letter
        d={{
          name: "Dr. Kwame Mensah, Senior Lecturer",
          dept: "Department of Petroleum Engineering",
          phone: "0593602676",
          email: "",
          date: "November 10, 2026",
          signature: null,
        }}
      />,
    );
    expect(screen.getByRole("img", { name: /Republic Hall, KNUST crest/i })).toHaveAttribute("src", logoAsset.url);
  });
});
