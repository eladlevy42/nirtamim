import { storesFunc } from "../async-db.service.js";
window.onload = onInit;

function onInit() {
  window.onChangePage = onChangePage;
  window.onSearch = onSearch;

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
