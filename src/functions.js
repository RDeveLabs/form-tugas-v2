import { mergeButton } from "./main";
import { showWarningToast } from "./notifications";

let errmsg = []; 

export function checkInput(elementInput, elementErr) {
  if (elementInput.value === "" || elementInput.value === "belum dipilih") {
    elementInput.classList.add("input-border");
    elementErr.innerHTML = "Masih kosong!";
    errmsg.push(elementErr.innerHTML);
  } else {
    elementInput.classList.remove("input-border");
    elementErr.innerHTML = "";
  }
}

export function checkErrMessage() {
  if (errmsg.length > 0) {
    mergeButton.innerText = "Merge / Gabungkan semua file";
    showWarningToast();
    while (errmsg.length > 0) {
      errmsg.pop();
    }
    return false;
  }
  return true;
}

export function checkWindowWidth() {
  let skala = null;

  if (window.innerWidth >= 768) {
    skala = 1.3;
  } else {
    skala = 0.6;
  }
  return skala;
}
