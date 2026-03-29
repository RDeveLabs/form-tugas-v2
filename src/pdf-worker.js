import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getRange, mergeButton } from "./main";
let errmsg = []; //array untuk menyimpan pesan error
let previewHasil = null;
let skala = null;


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

export async function startMerge() {
  mergeButton.innerText = "Loading ...";
  try {
    const { start, end } = getRange(); //import nilai variabel start dan end dari file main.js
    //element input
    const inputNama = document.getElementById("nama").value;
    const inputNim = document.getElementById("nim").value;
    const inputKelas = document.getElementById("kelas").value;
    const inputMatkul = document.getElementById("matkul").value;
    const inputPertemuan = document.getElementById("pertemuan").value;
    const inputDosen = document.getElementById("dosen").value;

    //kondisional kalo input ada yang  kosong, push pesan ke array errmsg
    if (inputNama === "") errmsg.push("Nama");
    if (inputNim === "") errmsg.push("NIM");
    if (inputKelas === "belum dipilih") errmsg.push("Kelas");
    if (inputMatkul === "belum dipilih") errmsg.push("Mata Kuliah");
    if (inputDosen === "belum dipilih") errmsg.push("Dosen");
    if (inputPertemuan === "belum dipilih") errmsg.push("Pertemuan");

    //menampilkan pesan error yang ada di array errmsg
    if (errmsg.length > 0) {
      mergeButton.innerText = "Merge / Gabungkan semua file";
      alert("Masih ada kolom yang belum di isi:\n- " + errmsg.join("\n- "));
      //hapus isi array errmsg setelah ditampilkan
      while (errmsg.length > 0) {
        errmsg.pop();
      }
      return;
    }

    //jika semua input terisi, lanjut ke proses merge
    const finalPDF = await PDFDocument.create();
    for (let i = start; i <= end; i++) {
      const buatCover = await buatHalamanCover(
        i,
        inputNama,
        inputNim,
        inputKelas,
        inputDosen,
        inputMatkul,
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
        alert(`Upload dulu semua filenya!`);
        mergeButton.innerText = "Merge / Gabungkan semua file";
        return;
      }
    }

    previewHasil = await finalPDF.save();

    if (window.innerWidth >= 768){
      skala = 1.3;
    } else {
      skala = .6;
    } 

    // previewHasil = Uint8Array dari pdf-lib
    pdfjsLib.getDocument({ data: previewHasil }).promise.then(async (pdf) => {
      const container = document.getElementById("pdf-container");
      container.innerHTML = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: skala });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        container.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport })
          .promise;
      }
      const eventBodyPreview = new CustomEvent("eventOpenBodyPreview");
      document.dispatchEvent(eventBodyPreview);
      const bodyPreview = document.querySelector(".body-preview");
      bodyPreview.style.display = "flex";
    });

    //menyimpan cache yang berisi hasil merge
    const blob = new Blob([previewHasil], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    //fungsi untuk download hasil merge
    document.addEventListener("eventDownloadPreview", () => {
      a.href = url;
      a.download = "PREVIEW HASIL MERGE";
      a.click();
    });

    //fungsi untuk mengapus cache hasil merge jika tombol kembali ditekan
    document.addEventListener("eventCloseBodyPreview", () => {
      URL.revokeObjectURL(url);
    });

    document.addEventListener("eventUpload", async () => {
      try{
        const namaFile = `${inputNama}_${inputNim}_${inputKelas}_${inputMatkul}.pdf`;
        const formdata = new FormData();
        formdata.append("file", blob, namaFile);
        const response = await fetch('https://api.rdevelabs.com/data', {
          method: 'POST',
          headers: {
            'x-rdl' : "test"
          },
          body: formdata
        });

        if (!response.ok){
          const err = await response.json();
          throw new Error(err.detail || "server error")
        }
        const data = await response.json();
        if (data.status === "ok"){
          alert("server aktif")
          console.log(data);
        }
      }catch (e){
        console.error("gagal", e);
        alert(`ada kesalahan ${e.message}`)
      }finally{

      }
    })
  } catch (e) {
    console.log(e);
  }
}
