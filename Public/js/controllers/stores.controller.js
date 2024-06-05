import { storesFunc } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";
window.onload = onInit;

function onInit() {
  // Expose functions to the window object
  window.onAddStore = onAddStore;
  window.onChangePage = onChangePage;
  window.onSearch = onSearch;
  // Add event listener for the form submission
  document.querySelector("#addStoreFrm").addEventListener("submit", onAddStore);
  document
    .getElementById("prevPage")
    .addEventListener("click", () => onChangePage(-1));
  document
    .getElementById("nextPage")
    .addEventListener("click", () => onChangePage(1));
  document
    .getElementById("searchStoreByName")
    .addEventListener("submit", () => storesFunc.search());
}
async function onAddStore(ev) {
  console.log(1);
  ev.preventDefault();
  console.log(2);
  let newStore = newStoreFunctions.getNewStoreData();
  console.log(newStore);
  try {
    await storesFunc.postStore(newStore);
    console.log("Store added successfully");
    let owner = storesFunc.getOwnerByID(storesFunc.getUserIdFromURL);
    owner.stores.append(newStore.id);
  } catch (err) {
    console.error(err);
  }
}

async function onChangePage(num) {
  storesFunc.changePage(num);
}
async function onSearch() {
  storesFunc.search();
}
