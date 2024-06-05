import { storesFunc } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";
window.onload = onInit;

function onInit() {
  // Expose functions to the window object

  window.onChangePage = onChangePage;
  window.onSearch = onSearch;
  // Add event listener for the form submission
  document.querySelector("#addStoreFrm").addEventListener("submit", onAddStore);
}
async function onAddStore(ev) {
  console.log(1);
  ev.preventDefault();
  storesFunc.search();
}

