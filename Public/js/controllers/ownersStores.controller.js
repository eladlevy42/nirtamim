import { loginFunc } from "../async-login.service.js";
import { storesFunc } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";
window.onload = onInit;
function onInit() {
  // Expose functions to the window object
  window.onAddStore = onAddStore;
  window.checkWordInPDF = checkWordInPDF;
  // Add event listener for the form submission
  document.getElementById("addStoreFrm").addEventListener("submit", onAddStore);
}
async function onAddStore(ev) {
  ev.preventDefault();
  const newStore = newStoreFunctions.getNewStoreData();
  try {
    await storesFunc.postStore(newStore);
    console.log("Store added successfully");
    const ownerId = storesFunc.getUserIdFromURL();
    try {
      await storesFunc.updateOwnerStores(ownerId);
    } catch (err) {
      toaster.showErrorToaster(err.message);
    }
  } catch (err) {
    toaster.showErrorToaster(err.message);
  }
}
