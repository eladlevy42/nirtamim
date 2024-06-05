export const toaster = {
  success,
  error,
};

function success(message) {
  alert(`Success: ${message}!`);
}

function error(message) {
  alert(`Error: ${message}!`);
}
