import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { QSection, QuestionOption, BidItem } from "./data";

const SECTION_TYPE_COLORS: Record<string, string> = {
  TECHNICAL:  "FF065F46",
  GENERAL:    "FF1E3A8A",
  HSE:        "FF78350F",
  COMPLIANCE: "FF7F1D1D",
};

const SECTION_BG_COLORS: Record<string, string> = {
  TECHNICAL:  "FFD1FAE5",
  GENERAL:    "FFDBEAFE",
  HSE:        "FFFEF3C7",
  COMPLIANCE: "FFFEE2E2",
};

export async function exportQuestionnaireToExcel(
  sections: QSection[],
  visibleQuestions: QuestionOption[],
  selectedOptions: Record<string, string>
) {
  const visibleIds = new Set(visibleQuestions.map((q) => q.id));

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "RFx Supplier Portal";

  const worksheet = workbook.addWorksheet("Questionnaire");

  worksheet.protect("rfx2025", {
    selectLockedCells: true,
    selectUnlockedCells: true,
  });

  worksheet.columns = [
    { header: "Section", key: "section", width: 22 },
    { header: "Question", key: "text", width: 52 },
    { header: "Type", key: "type", width: 16 },
    { header: "Answer", key: "answer", width: 32 },
  ];

  // Notice row — file upload warning
  const noticeRow = worksheet.getRow(1);
  noticeRow.height = 20;
  worksheet.mergeCells(1, 1, 1, 4);
  const noticeCell = noticeRow.getCell(1);
  noticeCell.value = "⚠  File Upload questions are not included in this sheet. Please upload those documents directly in the supplier portal.";
  noticeCell.font = { italic: true, size: 9, name: "Calibri", color: { argb: "FF92400E" } };
  noticeCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF3C7" } };
  noticeCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  noticeCell.border = { bottom: { style: "medium", color: { argb: "FFFCD34D" } } };
  noticeCell.protection = { locked: true };

  // Column header row — dark indigo (row 2 now)
  const headerRow = worksheet.getRow(2);
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10, name: "Calibri" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF312E81" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      bottom: { style: "medium", color: { argb: "FF1E1B4B" } },
      right: { style: "thin", color: { argb: "FF4338CA" } },
    };
    cell.protection = { locked: true };
  });

  // Freeze below notice + header
  worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 2 }];

  sections.forEach((sec) => {
    const secQuestions = sec.questions.filter(
      (q) => visibleIds.has(q.id) && q.type !== "FILE_UPLOAD"
    );
    if (secQuestions.length === 0) return;

    const sectionBg = SECTION_BG_COLORS[sec.type] ?? "FFE2E8F0";
    const sectionFg = SECTION_TYPE_COLORS[sec.type] ?? "FF1E293B";

    // Section header row
    const secRow = worksheet.addRow([`${sec.title}  (${sec.type})`, "", "", ""]);
    secRow.height = 18;
    worksheet.mergeCells(secRow.number, 1, secRow.number, 4);
    const secCell = secRow.getCell(1);
    secCell.font = { bold: true, size: 10, name: "Calibri", color: { argb: sectionFg } };
    secCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: sectionBg } };
    secCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    secCell.border = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "medium", color: { argb: sectionFg } },
    };
    secCell.protection = { locked: true };

    secQuestions.forEach((q, qi) => {
      const isEven = qi % 2 === 0;
      const row = worksheet.addRow({
        section: sec.title,
        text: q.text,
        type: q.type.replace(/_/g, " "),
        answer: selectedOptions[q.id] || "",
      });
      row.height = 16;

      ["section", "text", "type"].forEach((col) => {
        const cell = row.getCell(col);
        cell.protection = { locked: true };
        cell.font = { size: 10, name: "Calibri", color: { argb: "FF475569" } };
        cell.fill = {
          type: "pattern", pattern: "solid",
          fgColor: { argb: isEven ? "FFFAFAFA" : "FFF8FAFC" },
        };
        cell.alignment = { vertical: "middle", wrapText: col === "text" };
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } },
        };
      });

      const answerCell = row.getCell("answer");
      answerCell.protection = { locked: false };
      answerCell.font = { size: 10, name: "Calibri", color: { argb: "FF0F172A" } };
      answerCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFBEB" } };
      answerCell.alignment = { vertical: "middle" };
      answerCell.border = {
        top: { style: "thin", color: { argb: "FFFCD34D" } },
        bottom: { style: "thin", color: { argb: "FFFCD34D" } },
        left: { style: "thin", color: { argb: "FFFCD34D" } },
        right: { style: "thin", color: { argb: "FFFCD34D" } },
      };

      if (q.type === "SINGLE_CHOICE" && q.options) {
        answerCell.dataValidation = {
          type: "list", allowBlank: true,
          formulae: [`"${q.options.join(",")}"`],
          showErrorMessage: true, errorTitle: "Invalid choice",
          error: "Please select a value from the dropdown.",
        };
      } else if (q.type === "BOOLEAN") {
        answerCell.dataValidation = {
          type: "list", allowBlank: true,
          formulae: ['"yes,no"'],
        };
      } else if (q.type === "NUMERIC") {
        answerCell.dataValidation = {
          type: "decimal", operator: "greaterThanOrEqual", formulae: [0], allowBlank: true,
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "Questionnaire.xlsx");
}

export async function importQuestionnaireFromExcel(
  file: File,
  allQuestions: QuestionOption[],
  selectOpt: (qid: string, val: string) => void
) {
  // Build a lookup from question text → question id
  const textToId = new Map(allQuestions.map((q) => [q.text.trim(), q.id]));

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const worksheet = workbook.getWorksheet("Questionnaire");

  if (!worksheet) {
    alert("Invalid file: Missing 'Questionnaire' sheet.");
    return;
  }

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 2) return; // Skip notice row and column header row
    const questionText = row.getCell(2).value?.toString()?.trim();
    const answer = row.getCell(4).value?.toString();
    if (!questionText) return; // Section header rows have no question text in col 2
    const id = textToId.get(questionText);
    if (id && answer !== undefined) {
      selectOpt(id, answer);
    }
  });
}

export async function exportBidMatrixToExcel(bidItems: BidItem[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "RFx Supplier Portal";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Bid Matrix", {
    views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
  });

  worksheet.protect("rfx2025", {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: false,
    formatColumns: false,
    formatRows: false,
  });

  // Column definitions
  worksheet.columns = [
    { header: "ID", key: "id", width: 8 },
    { header: "Item Code", key: "item_code", width: 18 },
    { header: "Description", key: "description", width: 42 },
    { header: "Qty", key: "quantity", width: 10 },
    { header: "Unit", key: "unit", width: 10 },
    { header: "Unit Price (₹)", key: "unit_price", width: 16 },
    { header: "Lead Time (Days)", key: "lead_time_days", width: 18 },
    { header: "Brand", key: "brand", width: 20 },
    { header: "Model No.", key: "model_no", width: 20 },
    { header: "Country of Origin", key: "country_of_origin", width: 20 },
  ];

  // Header row styling — dark slate enterprise header
  const headerRow = worksheet.getRow(1);
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10, name: "Calibri" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E293B" } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: false };
    cell.border = {
      bottom: { style: "medium", color: { argb: "FF0F172A" } },
      right: { style: "thin", color: { argb: "FF334155" } },
    };
    cell.protection = { locked: true };
  });

  const READONLY_COLS = ["id", "item_code", "description", "quantity", "unit"];
  const EDITABLE_COLS = ["unit_price", "lead_time_days", "brand", "model_no", "country_of_origin"];

  bidItems.forEach((item, index) => {
    const row = worksheet.addRow({
      id: item.id,
      item_code: item.item_code,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      // Editable fields exported blank so supplier fills them in
      unit_price: "",
      lead_time_days: "",
      brand: "",
      model_no: "",
      country_of_origin: "",
    });

    row.height = 18;
    const isEven = index % 2 === 0;

    READONLY_COLS.forEach((col) => {
      const cell = row.getCell(col);
      cell.protection = { locked: true };
      cell.font = { size: 10, name: "Calibri", color: { argb: "FF475569" } };
      cell.fill = {
        type: "pattern", pattern: "solid",
        fgColor: { argb: isEven ? "FFF8FAFC" : "FFF1F5F9" },
      };
      cell.alignment = { vertical: "middle", horizontal: col === "description" ? "left" : "center" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };
    });

    EDITABLE_COLS.forEach((col) => {
      const cell = row.getCell(col);
      cell.protection = { locked: false };
      cell.font = { size: 10, name: "Calibri", color: { argb: "FF0F172A" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFFBEB" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin", color: { argb: "FFFCD34D" } },
        bottom: { style: "thin", color: { argb: "FFFCD34D" } },
        left: { style: "thin", color: { argb: "FFFCD34D" } },
        right: { style: "thin", color: { argb: "FFFCD34D" } },
      };
    });

    row.getCell("unit_price").dataValidation = {
      type: "decimal",
      operator: "greaterThanOrEqual",
      formulae: [0],
      allowBlank: true,
      showErrorMessage: true,
      errorTitle: "Invalid value",
      error: "Unit price must be a positive number.",
    };

    row.getCell("lead_time_days").dataValidation = {
      type: "whole",
      operator: "greaterThanOrEqual",
      formulae: [0],
      allowBlank: true,
      showErrorMessage: true,
      errorTitle: "Invalid value",
      error: "Lead time must be a whole number of days.",
    };

    row.getCell("country_of_origin").dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ['"IN,CN,DE,US"'],
      showErrorMessage: true,
      errorTitle: "Invalid country",
      error: "Please select a country from the dropdown.",
    };
  });

  // Legend row below data
  const legendRowNum = bidItems.length + 2;
  const legendRow = worksheet.getRow(legendRowNum);
  legendRow.height = 16;
  const legendCell = legendRow.getCell(1);
  legendCell.value = "🔒 Shaded cells are read-only.  ✏️  Yellow cells require your input.";
  legendCell.font = { italic: true, size: 9, color: { argb: "FF64748B" }, name: "Calibri" };
  worksheet.mergeCells(legendRowNum, 1, legendRowNum, 10);

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "BidMatrix.xlsx");
}

export async function importBidMatrixFromExcel(
  file: File,
  bidItems: BidItem[],
  updateBidItem: (index: number, field: keyof BidItem, value: string) => void
) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const worksheet = workbook.getWorksheet("Bid Matrix");

  if (!worksheet) {
    alert("Invalid file: Missing 'Bid Matrix' sheet.");
    return;
  }

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    const id = row.getCell(1).value?.toString();
    const index = bidItems.findIndex((b) => b.id.toString() === id);
    if (index === -1) return;

    const unitPrice = row.getCell(6).value?.toString() || "";
    const leadTime = row.getCell(7).value?.toString() || "";
    const brand = row.getCell(8).value?.toString() || "";
    const modelNo = row.getCell(9).value?.toString() || "";
    const country = row.getCell(10).value?.toString() || "";

    if (unitPrice !== undefined) updateBidItem(index, "unit_price", unitPrice);
    if (leadTime !== undefined) updateBidItem(index, "lead_time_days", leadTime);
    if (brand !== undefined) updateBidItem(index, "brand", brand);
    if (modelNo !== undefined) updateBidItem(index, "model_no", modelNo);
    if (country !== undefined) updateBidItem(index, "country_of_origin", country);
  });
}
