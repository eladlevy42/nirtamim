import { storesFunc } from "../async-db.service.js";

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
  storesFunc.changePage(num);
}

async function onSearch(ev) {
  ev.preventDefault();
  storesFunc.search();
}

async function onFilterByCategory(ev) {
  const selectedCategory = ev.target.getAttribute("value");
  storesFunc.filteredStores(selectedCategory);
}
