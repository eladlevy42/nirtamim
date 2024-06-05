import { dbService } from "../async-db.service.js";
import { storeService } from "../stores.service.local.js";
import { newStoreFunctions } from "../owners.service.local.js";
window.onload = onInit;

function onInit() {
  // Expose functions to the window object
  window.onChangePage = onChangePage;
  window.onSearch = onSearch;
  window.onFilterByCategory = onFilterByCategory;

  document
    .getElementById("prevPage")
    .addEventListener("click", () => onChangePage(-1));
  document
    .getElementById("nextPage")
    .addEventListener("click", () => onChangePage(1));
  document
    .getElementById("searchStoreByName")
    .addEventListener("submit", onSearch);

  document
    .querySelectorAll(".option")
    .forEach((option) => option.addEventListener("click", onFilterByCategory));
}

async function onChangePage(num) {
  storeService.changePage(num);
}

async function onSearch(ev) {
  ev.preventDefault();
  storeService.search();
}
