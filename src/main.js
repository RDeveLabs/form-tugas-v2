import { startMerge } from "./pdf-worker.js";
//element tombol
const pertemuanButton = document.querySelector(".pertemuan-button");
const mergeButton = document.querySelector(".merge-button");
const backButton = document.getElementById("back-button");
const downloadPreviewButton = document.getElementById("download-preview");
const uploadButton = document.getElementById("upload-button");
//container tugas
const containerTugas = document.querySelector(".container-tugas");

//array untuk pertemuan
const ranges = {
  "pertemuan-1-7": [1, 7],
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
  startMerge();
});

backButton.addEventListener("click", () => {
  const eventBodyPreview = new CustomEvent("eventCloseBodyPreview");
  document.dispatchEvent(eventBodyPreview);
});

export const getRange = () => ({ start, end });
