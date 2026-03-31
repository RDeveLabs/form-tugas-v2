import iziToast from "izitoast";

let position = null;

if (window.innerWidth >= 768) {
  position = "topRight";
} else {
  position = "bottomCenter";
}

iziToast.settings({
  position: position,
  drag: true,
});

iziToast.show({
  title: "Halo",
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
}

export const showErrorToast = (message) => {
  iziToast.error({
    title: "Error!",
    message: message,
  });
}