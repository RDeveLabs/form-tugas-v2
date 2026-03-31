import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  inputNama,
  inputNim,
  inputKelas,
  inputMatkul,
  inputDosen,
  inputPertemuan,
} from "./inputElements.js";
import {
  errNama,
  errNim,
  errKelas,
  errMatkul,
  errDosen,
  errPertemuan,
} from "./errSpans.js";
import { getRange, mergeButton, uploadButton } from "./main.js";
import { checkErrMessage, checkInput, checkWindowWidth } from "./functions.js";
import { showErrorToast, showSuccessToast } from "./notifications.js";

let previewHasil = null;

export async function buatHalamanCover(
  pertemuan,
  nama,
  nim,
  kelas,
  dosen,
  matkul,
) {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const labelX = 50;
  const valueX = 145;

  page.drawText(`Pertemuan ${pertemuan}`, {
    x: 50,
    y: height - 2 * 32,
    size: 32,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Nama", {
    x: labelX,
    y: height - 7 * 13,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(":", {
    x: labelX + 90,
    y: height - 7 * 13,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(nama, {
    x: valueX,
    y: height - 7 * 13,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText("NIM", {
    x: labelX,
    y: height - 7 * 16,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(":", {
    x: labelX + 90,
    y: height - 7 * 16,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(nim, {
    x: valueX,
    y: height - 7 * 16,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText("Kelas", {
    x: labelX,
    y: height - 7 * 19,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(":", {
    x: labelX + 90,
    y: height - 7 * 19,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(kelas, {
    x: valueX,
    y: height - 7 * 19,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText("Mata Kuliah", {
    x: labelX,
    y: height - 7 * 22,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(":", {
    x: labelX + 90,
    y: height - 7 * 22,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(matkul, {
    x: valueX,
    y: height - 7 * 22,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText("Dosen Pengampu", {
    x: labelX,
    y: height - 7 * 25,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(":", {
    x: labelX + 90,
    y: height - 7 * 25,
    size: 12,
    font: timesRomanFont,
  });

  page.drawText(dosen, {
    x: valueX,
    y: height - 7 * 25,
    size: 12,
    font: timesRomanFont,
  });

  return await pdfDoc.save();
}

export async function gabungPDF(coverBytes, uploadedFileBytes) {
  const mergedPdf = await PDFDocument.create();

  // halaman cover
  const coverDoc = await PDFDocument.load(coverBytes);
  const [halamanCover] = await mergedPdf.copyPages(coverDoc, [0]);
  mergedPdf.addPage(halamanCover);

  // file tugas
  const uploadedDoc = await PDFDocument.load(uploadedFileBytes);
  const pages = await mergedPdf.copyPages(
    uploadedDoc,
    uploadedDoc.getPageIndices(),
  );
  pages.forEach((page) => mergedPdf.addPage(page));

  return await mergedPdf.save();
}

document.addEventListener("eventStartMerge", async () => {
  try {
    mergeButton.innerText = "Loading ...";

    checkInput(inputNama, errNama);
    checkInput(inputNim, errNim);
    checkInput(inputKelas, errKelas);
    checkInput(inputMatkul, errMatkul);
    checkInput(inputDosen, errDosen);
    checkInput(inputPertemuan, errPertemuan);

    const eventUploadExit = new CustomEvent("eventUploadExit");

    if (checkErrMessage()) {
      //proses merge pdf
      const finalPDF = await PDFDocument.create();
      const { start, end } = getRange(); //dari main.js
      for (let i = start; i <= end; i++) {
        const buatCover = await buatHalamanCover(
          i,
          inputNama.value,
          inputNim.value,
          inputKelas.value,
          inputDosen.value,
          inputMatkul.value,
        );
        const fileInput = document.getElementById(`files${i}`);

        if (fileInput?.files[0]) {
          const fileUpload = await fileInput.files[0].arrayBuffer();
          const gabungFile = await gabungPDF(buatCover, fileUpload);

          const gabungDokumen = await PDFDocument.load(gabungFile);
          const halaman = await finalPDF.copyPages(
            gabungDokumen,
            gabungDokumen.getPageIndices(),
          );
          halaman.forEach((halaman) => finalPDF.addPage(halaman));
        } else {
          showErrorToast("Upload dulu filenya!");
          mergeButton.innerText = "Merge / Gabungkan semua file";
          return;
        }
      }
      previewHasil = await finalPDF.save();

      // previewHasil
      pdfjsLib.getDocument({ data: previewHasil }).promise.then(async (pdf) => {
        const container = document.getElementById("pdf-container");
        container.innerHTML = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: checkWindowWidth() });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          container.appendChild(canvas);
          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
          }).promise;
        }
        const eventBodyPreview = new CustomEvent("eventOpenBodyPreview");
        document.dispatchEvent(eventBodyPreview);
        const bodyPreview = document.querySelector(".body-preview");
        bodyPreview.style.display = "flex";
      });

      //Save output to cache
      const blob = new Blob([previewHasil], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      //Download output file from cache
      document.addEventListener("eventDownloadPreview", () => {
        a.href = url;
        a.download = "PREVIEW HASIL MERGE";
        a.click();
      });

      //Delete cahe after close preview
      document.addEventListener("eventCloseBodyPreview", () => {
        URL.revokeObjectURL(url);
      });

      //Upload output file to server
      document.addEventListener("eventUpload", async () => {
        try {
          const namaFile = `${inputNama}_${inputNim}_${inputKelas}_${inputMatkul}.pdf`;
          const formdata = new FormData();
          formdata.append("file", blob, namaFile);

          const token = import.meta.env.VITE_API_TOKEN;
          if (!token) {
            console.error("API token tidak ditemukan!");
            showErrorToast("API token tidak ditemukan, hubungi developer");
            uploadButton.innerText = "Compress & Upload";
            document.dispatchEvent(eventUploadExit);
            return;
          }

          const response = await fetch(import.meta.env.VITE_API_URL, {
            method: "POST",
            headers: {
              "x-rdl": token,
            },
            body: formdata,
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "server error");
          }
          const data = await response.json();
          if (data.status === "ok") {
            const completeCard = document.querySelector(".complete-card");
            completeCard.style.display = "flex";
            const eventUploadDone = new CustomEvent("eventUploadDone");
            document.dispatchEvent(eventUploadDone);
            showSuccessToast();
          }
        } catch (e) {
          document.dispatchEvent(eventUploadExit);
          uploadButton.innerText = "Compress & Upload";
          showErrorToast(`Gagal upload file: ${e.message}`);
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
});
