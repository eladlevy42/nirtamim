import { storesFunc } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";
window.onload = onInit;

function onInit() {
  // Expose functions to the window object

  window.onChangePage = onChangePage;
  window.onSearch = onSearch;
  // Add event listener for the form submission

  document
    .getElementById("prevPage")
    .addEventListener("click", () => onChangePage(-1));
  document
    .getElementById("nextPage")
    .addEventListener("click", () => onChangePage(1));
  document
    .getElementById("searchStoreByName")
    .addEventListener("submit", onSearch);
}

async function onChangePage(num) {
  storesFunc.changePage(num);
}
async function onSearch(ev) {
  ev.preventDefault();
  storesFunc.search();
}
