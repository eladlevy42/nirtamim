async function renderSpecificStore(storeId) {
  try {
    const store = await dbService.getStoreById(storeId);
    const owner = await dbService.getOwnerByID(store.ownerID);
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
                      <span class="rating">${dbService.calculateAvgRating(
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
    toaster.showErrorToast(err.message);
  }
}

function closePopUp() {
  const popupContainer = document.getElementById("storePopupContainer");
  popupContainer.classList.add("hidden");
}

async function deleteStore(storeId) {
  let ownerId;
  try {
    const storeResponse = await axios.get(`${storesUrl}/${storeId}`);
    const storeData = storeResponse.data;
    ownerId = storeData.ownerID;

    await axios.delete(`${storesUrl}/${storeId}`);

    const ownerResponse = await axios.get(`${ownerUrl}/${ownerId}`);
    const ownerData = ownerResponse.data;
    const updatedStores = ownerData.stores.filter((id) => id !== storeId);

    await axios.put(`${ownerUrl}/${ownerId}`, {
      ...ownerData,
      stores: updatedStores,
    });

    closePopUp();
    OnRenderOwnerStores(ownerId); // render stores list after deletion
  } catch (error) {
    toaster.showErrorToast("Error deleting store: " + error.message);
  }
}

async function editStore(storeId) {
  const storeResponse = await axios.get(`${storesUrl}/${storeId}`);
  const storeData = storeResponse.data;

  const storeDetailsContainer = document.querySelector(".store-details");
  storeDetailsContainer.innerHTML = `
      <form id="editStoreForm">
        <label for="storeName">Name:</label>
        <input type="text" id="storeName" value="${storeData.name}" />
        
        <label for="storeCategories">Categories:</label>
        <input type="text" id="storeCategories" value="${storeData.categories.join(
          ", "
        )}" />
        
        <label for="storeCity">City:</label>
        <input type="text" id="storeCity" value="${storeData.location.city}" />
        
        <label for="storeDistrict">District:</label>
        <input type="text" id="storeDistrict" value="${
          storeData.location.district
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
        await axios.put(`${storesUrl}/${storeId}`, updatedStore);
        closePopUp();
        OnRenderOwnerStores(storeData.ownerID); //render stores list after update
      } catch (error) {
        toaster.showErrorToast("Error updating store:");
      }
    });
}
