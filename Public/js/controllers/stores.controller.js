import { storesFunc } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";
window.onload = onInit;

function onInit() {
  // Expose functions to the window object
  window.onAddStore = onAddStore;
  // Add event listener for the form submission
  document.querySelector("#addStoreFrm").addEventListener("submit", onAddStore);
  document
    .getElementById("prevPage")
    .addEventListener("click", () => changePage(-1));
  document
    .getElementById("nextPage")
    .addEventListener("click", () => changePage(1));
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
    //close the div
    //render the new storeList
  } catch (err) {
    console.error(err);
  }
}
