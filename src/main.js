import { startMerge } from "./pdf-worker.js";
//element tombol
const pertemuanButton = document.querySelector(".pertemuan-button");
export const mergeButton = document.querySelector(".merge-button");
const backButton = document.getElementById("back-button");
const downloadPreviewButton = document.getElementById("download-preview");
const uploadButton = document.getElementById("upload-button");
//container tugas
const containerTugas = document.querySelector(".container-tugas");

//array untuk pertemuan
const ranges = {
  "pertemuan-1-7": [1, 1],
  "pertemuan-9-15": [9, 15],
};

let start = null;
let end = null;

pertemuanButton.addEventListener("click", () => {
  const inputPertemuan = document.getElementById("pertemuan").value;
  if (inputPertemuan in ranges) {
    [start, end] = ranges[inputPertemuan];
    containerTugas.innerHTML = "";

    for (let i = start; i <= end; i++) {
      containerTugas.innerHTML += `
      <div class="upload-file${i} bg-(--upload-file) border-box rounded-md flex items-center justify-center cursor-pointer hover:bg-amber-200">
        <label for="files${i}" class="bg-(--upload-file) w-full p-4 text-lg font-semibold cursor-pointer">Upload file tugas pertemuan ${i}</label>
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
        label.style.background = "#80ed99";
        label.style.color = "#22577a"
      };
    }
  } else {
    alert("pilih pertemuan dulu");
  }
});

mergeButton.addEventListener("click", async () => {
  startMerge();
});

backButton.addEventListener("click", () => {
  const eventBodyPreview = new CustomEvent("eventCloseBodyPreview");
  document.dispatchEvent(eventBodyPreview);
});

downloadPreviewButton.addEventListener("click", () => {
  const eventDownloadPreview = new CustomEvent("eventDownloadPreview");
  document.dispatchEvent(eventDownloadPreview);
});

export const getRange = () => ({ start, end });
