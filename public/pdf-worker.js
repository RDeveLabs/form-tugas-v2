import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export {PDFDocument}

export async function buatHalamanCover(pertemuan, nama, nim, kelas, dosen, matkul) {
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()
  const labelX = 50;
  const valueX = 145;

  page.drawText(`Pertemuan ${pertemuan}`, {
    x: 50,
    y: height - 2 * 32,
    size: 32,
    font: timesRomanFont,
    color: rgb(0, 0, 0)
  })

  page.drawText('Nama', {
      x: labelX,
      y: height - 7 * 13,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(':', {
      x: labelX + 90,
      y: height - 7 * 13,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(nama, {
      x: valueX,
      y: height - 7 * 13,
      size: 12,
      font: timesRomanFont
  })

  page.drawText('NIM', {
      x: labelX,
      y: height - 7 * 16,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(':', {
      x: labelX + 90,
      y: height - 7 * 16,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(nim, {
      x: valueX,
      y: height - 7 * 16,
      size: 12,
      font: timesRomanFont
  })

  page.drawText('Kelas', {
      x: labelX,
      y: height - 7 * 19,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(':', {
      x: labelX + 90,
      y: height - 7 * 19,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(kelas, {
      x: valueX,
      y: height - 7 * 19,
      size: 12,
      font: timesRomanFont
  })

  page.drawText('Mata Kuliah', {
      x: labelX,
      y: height - 7 * 22,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(':', {
      x: labelX + 90,
      y: height - 7 * 22,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(matkul, {
      x: valueX,
      y: height - 7 * 22,
      size: 12,
      font: timesRomanFont
  })

  page.drawText('Dosen Pengampu', {
      x: labelX,
      y: height - 7 * 25,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(':', {
      x: labelX + 90,
      y: height - 7 * 25,
      size: 12,
      font: timesRomanFont
  })

  page.drawText(dosen, {
      x: valueX,
      y: height - 7 * 25,
      size: 12,
      font: timesRomanFont
  })

  return await pdfDoc.save()
}

export async function gabungPDF(coverBytes, uploadedFileBytes) {
  const mergedPdf = await PDFDocument.create()
  
  // halaman cover
  const coverDoc = await PDFDocument.load(coverBytes)
  const [halamanCover] = await mergedPdf.copyPages(coverDoc, [0])
  mergedPdf.addPage(halamanCover)

  // file tugas
  const uploadedDoc = await PDFDocument.load(uploadedFileBytes)
  const pages = await mergedPdf.copyPages(uploadedDoc, uploadedDoc.getPageIndices())
  pages.forEach((page) => mergedPdf.addPage(page))

  return await mergedPdf.save()
}

export function downloadPDF(data, filename, type) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}