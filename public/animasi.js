import { animate, spring, stagger, splitText } from "animejs";
import { getRange } from "./main";

document.querySelector(".pertemuan-button").addEventListener("click", () => {
  const { start, end } = getRange();

  // kumpulkan semua elemen dulu
  const elements = [];
  for (let i = start; i <= end; i++) {
    const el = document.querySelector(`.upload-file${i}`);
    if (el) elements.push(el);
  }

  // animate sekaligus sebagai group
  animate(elements, {
    translateX: [100, 0],
    duration: 2000,
    opacity: [0, 1],
    ease: spring(),
    delay: stagger(100),
  });
});

const { chars: judul } = splitText("h1", {
  chars: true,
});
const { chars: matakuliah } = splitText(".matakuliah", {
  chars: true,
});

animate(judul, {
  y: [{ to: ["-100%", "0%"] }],
  opacity: [0, 1],
  duration: 500,
  ease: spring({ bounce: 0.5, duration: 500 }),
  delay: stagger(50),
});

animate(matakuliah, {
  x: [{ to: ["-100", "0%"] }],
  duration: 500,
  opacity: [0, 1],
  ease: spring({ bounce: 0.5, duration: 500 }),
  delay: stagger(50),
});

animate("div label", {
  translateX: [100, 0],
  duration: 2000,
  opacity: [0, 1],
  ease: spring(),
  delay: stagger(100),
});

animate("div input, select, .pertemuan-button", {
  duration: 2000,
  opacity: [0, 1],
  ease: spring(),
  delay: stagger(100),
});
