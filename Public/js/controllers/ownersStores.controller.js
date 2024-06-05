import { loginFunc } from "../async-login.service.js";
import { dbService } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";
window.onload = onInit;
function onInit() {
  // Expose functions to the window object
  window.onAddStore = onAddStore;
  // Add event listener for the form submission
  document.getElementById("addStoreFrm").addEventListener("submit", onAddStore);
}
async function onAddStore(ev) {
  ev.preventDefault();
  const newStore = newStoreFunctions.getNewStoreData();
  try {
    await dbService.postStore(newStore);
    console.log("Store added successfully");
    const ownerId = dbService.getUserIdFromURL();
    try {
      await dbService.updateOwnerStores(ownerId);
    } catch (err) {
      alert(err);
    }
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}
