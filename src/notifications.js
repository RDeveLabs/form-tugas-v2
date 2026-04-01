import iziToast from "izitoast";
import { bullhornIcon, graduationCapIcon } from "./font-awesome.mjs";

let position = null;

if (window.innerWidth >= 768) {
  position = "topRight";
} else {
  position = "bottomCenter";
}

iziToast.settings({
  position: position,
  drag: true,
  layout: 2,
});

iziToast.show({
  title: bullhornIcon.html[0] + " Selamat datang",
  message:
    "Silahkan ikuti petunjuk yang ada pada halaman tutorial dengan menekan tombol " +
    graduationCapIcon.html[0],
});

export const showWarningToast = () => {
  iziToast.warning({
    title: "Warning!",
    message: "Masih ada kolom yang belum di isi",
  });
};

export const showSuccessToast = () => {
  iziToast.success({
    title: "Sukses!",
    message: "File berhasil diupload",
  });
};

export const showErrorToast = (message) => {
  iziToast.error({
    title: "Error!",
    message: message,
  });
};
