import { loginFunc } from "../async-login.service.js";
import { storesFunc } from "../async-db.service.js";
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
  //   alert("");
  console.log(newStore);
  try {
    await storesFunc.postStore(newStore);
    console.log("Store added successfully");
    // alert(storesFunc.getUserIdFromURL());
    const owner = await storesFunc.getOwnerByID(storesFunc.getUserIdFromURL());
    owner.stores.push(newStore.id);
    try {
      await storesFunc.updateOwner(owner);
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}
