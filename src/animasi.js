import { animate, spring, stagger, splitText } from "animejs";
import { getRange, mergeButton } from "./main";

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

document.addEventListener("eventOpenBodyPreview", () => {
  mergeButton.innerText = "Merge / Gabungkan semua file";
  animate(".background-card", {
    opacity: [0, 0.8],
    duration: 500,
    ease: "inOut",
  });

  animate(".preview-card", {
    translateY: [1000, 0],
    duration: 1000,
    ease: spring({ bounce: 0.3, duration: 700 }),
    opacity: [0, 1],
  });
});

document.addEventListener("eventCloseBodyPreview", () => {
  animate(".background-card", {
    opacity: [0.8, 0],
    duration: 500,
    ease: "inOut",
  });

  animate(".preview-card", {
    translateY: [0, -1000],
    duration: 1000,
    ease: spring({ bounce: 0.3, duration: 700 }),
    opacity: [1, 0],
  });
  setTimeout(() => {
    const bodyPreview = document.querySelector(".body-preview");
    bodyPreview.style.display = "none";
  }, 800);
});

const SQUEEZE_DUR = 900;
const HOLD_DUR = 50;
const EXPAND_DUR = 800;
const GAP = 200;

function spawnDrips() {
  const container = document.getElementById("drips");
  for (let i = 0; i < 8; i++) {
    const d = document.createElement("div");
    const size = Math.random() * 5 + 4;
    const side = i < 4 ? -1 : 1;
    d.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:#7F77DD;
      opacity:0.9;
      top:0;
      left:0;
    `;
    container.appendChild(d);

    animate(d, {
      translateX: side * (Math.random() * 75 + 30),
      translateY: Math.random() * 20 - 10,
      opacity: 0,
      scale: 0.2,
      duration: 650,
      easing: "easeOutCubic",
      onComplete: () => d.remove(),
    });
  }
}

function loopCompress() {
  animate("#plate-top", {
    top: "65px",
    duration: SQUEEZE_DUR,
    ease: "inOutQuart",
  });

  animate("#plate-bot", {
    bottom: "65px",
    duration: SQUEEZE_DUR,
    ease: "inOutQuart",
  });

  animate("#file-block", {
    height: "26px",
    width: "185px",
    borderRadius: "3px",
    duration: SQUEEZE_DUR,
    ease: "inOutQuart",
    onComplete: () => {
      spawnDrips();
      setTimeout(() => {
        animate("#plate-top", {
          top: "17px",
          duration: EXPAND_DUR,
          ease: spring({ stiffness: 180, damping: 10 }),
        });

        animate("#plate-bot", {
          bottom: "17px",
          duration: EXPAND_DUR,
          ease: spring({ stiffness: 180, damping: 10 }),
        });

        animate("#file-block", {
          height: "120px",
          width: "100px",
          borderRadius: "12px",
          duration: EXPAND_DUR,
          ease: spring({ stiffness: 200, damping: 14 }),
          onComplete: () => {
            setTimeout(loopCompress, GAP);
          },
        });
      }, HOLD_DUR);
    },
  });

  animate(".fline", {
    keyframes: [
      { height: "2px", duration: SQUEEZE_DUR },
      { height: "2px", duration: HOLD_DUR },
      { height: "4px", duration: EXPAND_DUR },
    ],
    delay: stagger(40),
    ease: "inOutQuart",
  });
}
document.addEventListener("eventUpload", () => {
  animate(".loading-background", {
    opacity: [0, 0.8],
    duration: 500,
    ease: "inOut",
  });

  animate(".compress-card", {
    translateY: [1000, 0],
    duration: 1000,
    ease: spring({ bounce: 0.3, duration: 700 }),
    opacity: [0, 1],
  });
  loopCompress();
});
document.addEventListener("eventUploadExit", () => {
  animate(".loading-background", {
    opacity: [0.8, 0],
    duration: 500,
    ease: "inOut",
  });

  animate(".compress-card", {
    translateY: [0, -1000],
    duration: 1000,
    ease: spring({ bounce: 0.3, duration: 700 }),
    opacity: [1, 0],
  });

  setTimeout(() => {
    const loading = document.querySelector(".loading");
    loading.style.display = "none";
  }, 800);
});

document.addEventListener("eventUploadDone", () => {
  animate(".compress-card", {
    translateY: [0, -1000],
    duration: 1000,
    ease: spring({ bounce: 0.3, duration: 700 }),
    opacity: [1, 0],
  });

  animate(".complete-card", {
    translateY: [1000, 0],
    duration: 1000,
    ease: spring({ bounce: 0.3, duration: 700 }),
    opacity: [0, 1],
  });


  setTimeout(() => {
    const compressCard = document.querySelector(".compress-card");
    compressCard.style.display = "none";
  }, 800);
})