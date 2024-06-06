function createToastIfNeeded() {
  if (!document.querySelector("#toaster")) {
    const toaster = document.createElement("div");
    toaster.id = "toaster";
    document.body.appendChild(toaster);
  }
}
function showErrorToast(message) {
  console.log(message);
  createToastIfNeeded();
  const toast = document.querySelector("#toaster");
  toast.innerHTML = `<strong>Error!</strong> ${message}`;
  toast.className = "show";
  toast.classList.add("red");
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
    toast.className = toast.className.replace("red", "");
  }, 3000);
}

function showSuccessToast(message) {
  createToastIfNeeded(); //
  const toast = document.querySelector("#toaster");
  toast.innerHTML = `<strong>Success!</strong> ${message}`;
  toast.className = "show";
  toast.classList.add("green");
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
    toast.className = toast.className.replace("green", "");
  }, 3000);
}

export const toaster = { showErrorToast, showSuccessToast };
