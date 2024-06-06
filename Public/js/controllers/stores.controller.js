import { dbService } from "../async-db.service.js";
import { storeService } from "../stores.service.local.js";
import { newStoreFunctions } from "../owners.service.local.js";
window.onload = onInit;
async function onInit() {
  window.onSearch = onSearch;

  document
    .getElementById("searchStoreByName")
    .addEventListener("submit", onSearch);
  await storeService.resetLocalStore();
  storeService.displayStores();
}

async function onSearch(ev) {
  ev.preventDefault();
  storeService.search();
}
