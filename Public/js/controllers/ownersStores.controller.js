import { loginFunc } from "../async-login.service.js";
import { dbService } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";

window.onload = onInit;
function onInit() {
  window.OnRenderOwnerStores = OnRenderOwnerStores;
  window.onAddStore = onAddStore;
  document.getElementById("addStoreFrm").addEventListener("submit", onAddStore);
  OnRenderOwnerStores();
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
      toaster.showErrorToaster("err.message");
    }
  } catch (err) {
    toaster.showErrorToaster("err.message");
  }
}

async function OnRenderOwnerStores() {
  const ownerId = dbService.getUserIdFromURL();
  const storesContainer = document.querySelector(".stores-container");
  try {
    const storeIds = await dbService.getAllOwnerStores(ownerId);
    console.log(storeIds);
    if (storeIds.length === 0) {
      storesContainer.innerHTML = "<p>אין עוד חנויות /p>";
      return;
    }

    const storePromises = storeIds.map((storeId) =>
      dbService.getStoreById(storeId)
    );

    console.log(storePromises);
    const stores = await Promise.all(storePromises);
    console.log(stores);
    const storeCards = stores
      .map(
        (store) =>
          `<div class="store-card grid-group">
        <div class="store-img__wrapper flex-group">
        <img
                class="store-img"
                src="${store.img}"
                alt="${store.name}"
            />
        </div>
        <div class="store-details">
          <h3>${store.name}</h3>
          <div class="group-details flex-group">
            <p class="store-categories">${store.categories.join(", ")}</p>
          </div>
          <div class="store__sub-details flex-group">
            <p class="store-hours">${store.details.hours}</p>
            <p class="store-location">
              <span class="city">${
                store.location.city
              }</span>,<span class="district"
                >${store.location.district}
            </p>
          </div>
          <p class="store-rating">
              <i class="fa-solid fa-star filled"></i>
              <span class="rating">${dbService.calculateAvgRating(
                store.comments
              )}</span>
            </p>
        </div>
      </div>`
      )
      .join("");
    console.log(storeCards);
    storesContainer.innerHTML = storeCards;
  } catch (err) {
    console.error(err);
  }
}
