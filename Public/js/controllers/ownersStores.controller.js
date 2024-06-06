import { loginFunc } from "../async-login.service.js";
import { dbService } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";

window.onload = onInit;
function onInit() {
  window.OnRenderOwnerStores = OnRenderOwnerStores;
  window.renderSpecificStore = renderSpecificStore;
  window.closePopUp = closePopUp;
  window.deleteStore = handleDeleteStore;
  window.editStore = handleEditStore;
  window.onAddStore = onAddStore;
  document.querySelector("#addNewStore").addEventListener("click", addNewStore);
  document.getElementById("addStoreFrm").addEventListener("submit", onAddStore);
  OnRenderOwnerStores();
  renderSpecificStore();
}
function addNewStore() {
  document.querySelector(".overlay").style.display = "block";
  document.querySelector(".close-overlay").style.display = "block";
  document
    .querySelector(".close-overlay")
    .addEventListener("click", closeOverlay);
  document.querySelector(".pop-up__container").style.display = "block";
}

function closeOverlay() {
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".close-overlay").style.display = "none";
  document.querySelector(".pop-up__container").style.display = "none";
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
          `<div id="${store.id}" class="store-card grid-group">
        <div class="store-img__wrapper flex-group">
        <img
                class="store-img"
                src="${store.img}"
                alt="${store.name}"
                onerror="this.onerror=null; this.src='https://www.svgrepo.com/show/508699/landscape-placeholder.svg';"
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
            <span id="time">שעות עבודה: ${store.details.hours}</span>
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

async function renderSpecificStore() {
  const ownerId = dbService.getUserIdFromURL();
  try {
    const store = await dbService.getStoreById(storeId);
    const owner = await dbService.getOwnerByID(ownerId);
    const popupHTML = `
      <div class="overlay" onclick="closePopUp()"></div>
      <div class="pop-up__container">
        <i class="close-overlay fa-solid fa-xmark" onclick="closePopUp()"></i>
        <h1>${store.name}</h1>
        <div class="store-container grid-group">
          <div class="store-wrapper">
            <div class="store-img">
              <img src="${store.img}" alt="${store.name}" />
            </div>
            <div class="btnsEdit">
              <button onclick="editStore('${storeId}')" class="edit" id="editButton">Edit</button>
              <button onclick="deleteStore('${storeId}')" class="delete" id="deleteButton">Delete</button>
            </div>
            <div class="store-details flex-group">
              <div class="storeDataContainer">
                <div class="categories-container">
                  <h4>קטגוריה:</h4>
                  <p class="categories">${store.categories.join(", ")}</p>
                </div>
                <div class="rating-container">
                  <h4>דירוג:</h4>
                  <p class="flex-group">
                    <i class="fa-solid fa-star filled"></i>
                    <span class="rating">${calculateAvgRating(
                      store.comments
                    )}</span>
                  </p>
                </div>
                <div id="storeAdress" class="address">
                  <span class="city">${store.location.city}</span>,
                  <span class="address">${store.location.district}</span>
                </div>
                <div id="storeLinks">
                  <a href="${
                    store.details.link
                  }" class="store__website"><i class="fa-solid fa-house-user"></i></a>
                  <a href="${
                    store.details.phone
                  }" class="store__phone-number"><i class="fa-solid fa-phone"></i></a>
                </div>
              </div>
            </div>
            <div class="reviews-container">
              <div id="allReviews">
                ${renderComments(store.comments)}
              </div>
              <div class="add-review__wrapper flex-group">
                <button id="addNewComment" class="btn"><i class="fa-solid fa-plus"></i></button>
                <p>הוסף תגובה חדשה</p>
              </div>
            </div>
          </div>
          <div class="about-user-wrapper">
            <div class="container">
              <div class="leftStoreContainer">
                <h2>על הבעלים:</h2>
                <div class="aboutMeContainer">
                  <p id="ownerDescription">${owner.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    const popupContainer = document.getElementById("storePopupContainer");
    popupContainer.innerHTML = popupHTML;
    popupContainer.classList.remove("hidden");
  } catch (err) {
    // toaster.showErrorToast("err.message");
  }
}

function closePopUp() {
  const popupContainer = document.getElementById("storePopupContainer");
  popupContainer.classList.add("hidden");
}

async function handleDeleteStore(storeId) {
  try {
    await dbService.deleteStore(storeId);
    const store = await dbService.getStoreById(storeId);
    const ownerId = store.ownerID;
    const owner = await dbService.getOwnerByID(ownerId);
    const updatedStores = owner.stores.filter((id) => id !== storeId);
    await dbService.updateOwnerStores(ownerId, updatedStores);
    closePopUp();
    OnRenderOwnerStores(ownerId);
  } catch (error) {
    toaster.showErrorToast("Error deleting store: " + error.message);
  }
}

async function handleEditStore(storeId) {
  try {
    const store = await dbService.getStoreById(storeId);
    const storeDetailsContainer = document.querySelector(".store-details");
    storeDetailsContainer.innerHTML = `
      <form id="editStoreForm">
        <label for="storeName">Name:</label>
        <input type="text" id="storeName" value="${store.name}" />
        
        <label for="storeCategories">Categories:</label>
        <input type="text" id="storeCategories" value="${store.categories.join(
          ", "
        )}" />
        
        <label for="storeCity">City:</label>
        <input type="text" id="storeCity" value="${store.location.city}" />
        
        <label for="storeDistrict">District:</label>
        <input type="text" id="storeDistrict" value="${
          store.location.district
        }" />
        
        <button type="submit">Save</button>
      </form>
    `;

    document
      .getElementById("editStoreForm")
      .addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const updatedStore = {
          name: document.getElementById("storeName").value,
          categories: document
            .getElementById("storeCategories")
            .value.split(",")
            .map((s) => s.trim()),
          location: {
            city: document.getElementById("storeCity").value,
            district: document.getElementById("storeDistrict").value,
          },
        };

        try {
          await dbService.updateStore(storeId, updatedStore);
          closePopUp();
          OnRenderOwnerStores(store.ownerID);
        } catch (error) {
          toaster.showErrorToast("Error updating store: " + error.message);
        }
      });
  } catch (error) {
    toaster.showErrorToast("Error editing store: " + error.message);
  }
}
