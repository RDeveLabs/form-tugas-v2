import { PDFDocument, buatHalamanCover, gabungPDF, downloadPDF } from "./pdf-worker.js";
//element tombol
const pertemuanButton = document.querySelector(".pertemuan-button");
const mergeButton = document.querySelector(".merge-button");
//container tugas
const containerTugas = document.querySelector(".container-tugas");

//array untuk pertemuan
const ranges = {
  "pertemuan-1-7": [1, 7],
  "pertemuan-9-15": [9, 15],
};

let start = null;
let end = null;
let errmsg = []; //array untuk menyimpan pesan error
let previewHasil = null;

pertemuanButton.addEventListener("click", () => {
  const inputPertemuan = document.getElementById("pertemuan").value;
  if (inputPertemuan in ranges) {
    [start, end] = ranges[inputPertemuan];
    containerTugas.innerHTML = "";

    for (let i = start; i <= end; i++) {
      containerTugas.innerHTML += `
      <div class="upload-file${i} bg-amber-100 border-box rounded-md flex items-center justify-center cursor-pointer hover:bg-amber-200">
        <label for="files${i}" class="bg-amber-200 w-full p-4 text-lg font-semibold cursor-pointer">Upload file tugas pertemuan ${i}</label>
        <input required id="files${i}" type="file" accept=".pdf" hidden>
      </div>
    `;
    }

    for (let i = start; i <= end; i++) {
      const input = document.getElementById(`files${i}`);
      const label = document.querySelector(`label[for=files${i}]`);
      if (!input || !label) continue;

      input.onchange = function () {
        label.innerText = this.files[0]?.name ?? "Browse Files";
      };
    }
  } else {
    alert("pilih pertemuan dulu");
  }
});

mergeButton.addEventListener("click", async () => {
  try{
    //element input
    const inputNama = document.getElementById("nama").value;
    const inputNim = document.getElementById("nim").value;
    const inputKelas = document.getElementById("kelas").value;
    const inputMatkul = document.getElementById("matkul").value;
    const inputDosen = document.getElementById("dosen").value;
  
    //kondisional kalo input ada yang  kosong, push pesan ke array errmsg
    if (inputNama === "") errmsg.push("Nama");
    if (inputNim === "") errmsg.push("NIM");
    if (inputKelas === "belum dipilih") errmsg.push("Kelas");
    if (inputDosen === "belum dipilih") errmsg.push("Dosen");
    if (inputMatkul === "belum dipilih") errmsg.push("Mata Kuliah");
  
    //menampilkan pesan error yang ada di array errmsg
    if (errmsg.length > 0) {
      alert("Masih ada kolom yang belum di isi:\n- " + errmsg.join("\n- "));
      //hapus isi array errmsg setelah ditampilkan
      while (errmsg.length > 0) {
        errmsg.pop();
      }
      return;
    }

    const finalPDF = await PDFDocument.create();

    for (let i = start; i <= end; i++){
      const buatCover = await buatHalamanCover(i, inputNama, inputNim, inputKelas, inputDosen, inputMatkul);
      const fileInput = document.getElementById(`files${i}`);

      if (fileInput?.files[0]) {
        const fileUpload = await fileInput.files[0].arrayBuffer();
        const gabungFile = await gabungPDF(buatCover, fileUpload);

        const gabungDokumen = await PDFDocument.load(gabungFile);
        const halaman = await finalPDF.copyPages(gabungDokumen, gabungDokumen.getPageIndices());
        halaman.forEach((halaman) => finalPDF.addPage(halaman));
      } else {
        alert(`Upload file untuk pertemuan ${i} dulu!`);
        return;
      }
    }

    previewHasil = await finalPDF.save();

    const blob = new Blob([previewHasil], {type: "application/pdf"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "File sudah digabung"
    a.click();
    URL.revokeObjectURL(url);

  }catch(e){
    console.log(e);
  }


});

export const getRange = () => ({ start, end });
