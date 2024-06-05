import { renderHTML } from "./renderHTML.service.js";
import { toaster } from "/public/js/toast.sevice.js";
const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";

// let currentPage = 1;
// let allStores = [];
// const storesPerPage = 9;
// let totalStores = 0;
// const storesContainer = document.querySelector("#allStoresContainer");
const displayStores = document.getElementById("displayStoreBySearch");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageNumberElement = document.getElementById("pageNumber");

// optionContainer.addEventListener("change", () => {
//   currentPage = 1;
//   const selectedStores = optionContainer.value;
//   filteredStores(selectedStores);
// });

function filteredStores(category) {
  const filteredStores = allStores.filter(
    (store) => category === "" || store.categories.join(", ") === category
  );
  totalStores = filteredStores.length;
  displayPage(filteredStores);
}

async function getAllStores() {
  displayStores.innerHTML = "";
  displayStores.classList.add("hidden");

  try {
    const response = await axios.get(storesUrl);
    allStores = response.data;
    totalStores = allStores.length;
    if (totalStores === 0) {
      toaster.showErrorToaster("no stores found");
    } else {
      currentPage = 1;
      displayPage(allStores);
    }
  } catch (error) {
    toaster.showErrorToaster("Error fetching stores");
  } finally {
    displayStores.classList.remove("hidden");
  }
}

function changePage(direction) {
  const maxPage = Math.ceil(totalStores / storesPerPage);
  currentPage = Math.min(Math.max(currentPage + direction, 1), maxPage);
  displayPage(allStores);
}

function calculateAvgRating(commentsArray) {
  const total = commentsArray.reduce((acc, comment) => {
    acc += Number(comment.ratings);
    return acc;
  }, 0);
  return (total / commentsArray.length).toFixed(1);
}

function displayPage(stores) {
  const start = (currentPage - 1) * storesPerPage;
  const end = start + storesPerPage;
  const paginatedStores = stores.slice(start, end);

  storesContainer.innerHTML = paginatedStores
    .map((store) => {
      return `<div class="store-card grid-group">
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
            <span class="rating">${calculateAvgRating(store.comments)}</span>
          </p>
      </div>
    </div>`;
    })
    .join("");

  const maxPage = Math.ceil(totalStores / storesPerPage);

  prevPageButton.classList.toggle("hidden", currentPage === 1);
  nextPageButton.classList.toggle(
    "hidden",
    currentPage === maxPage || totalStores <= storesPerPage
  );

  if (maxPage <= 1) {
    prevPageButton.classList.add("hidden");
    nextPageButton.classList.add("hidden");
  }

  pageNumberElement.innerText = currentPage;
}

const search = async function () {
  const searchQuery = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (!searchQuery) {
    await getAllStores();
    return;
  }

  displayStores.innerHTML = "";
  displayStores.classList.add("hidden");

  try {
    const response = await axios.get(storesUrl);
    allStores = response.data.filter((store) =>
      store.name.toLowerCase().includes(searchQuery)
    );

    totalStores = allStores.length;
    if (totalStores === 0) {
      displayStores.innerHTML = "<p>No stores found</p>";
    } else {
      currentPage = 1;
      displayPage(allStores);
    }
  } catch (error) {
    toaster.showErrorToaster("Error searching stores: " + error.message);
  } finally {
    displayStores.classList.remove("hidden");
  }
};
////////////

function getUserIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("userId");
}

async function getStore() {
  try {
    const res = await axios.get(storesUrl);
    return res.data;
  } catch (error) {
    toaster.showErrorToaster(error.message);
  }
}

async function getStoreById(storeId) {
  try {
    const res = await axios.get(`${storesUrl}/${storeId}`);
    return res.data;
  } catch (error) {
    toaster.showErrorToaster(error.message);
  }
}

async function postStore(storeData) {
  try {
    await axios.post(storesUrl, storeData);
  } catch (error) {
    toaster.showErrorToaster(error.message);
  }
}

async function updateStore(storeId, updateStoreData) {
  try {
    const res = await axios.put(`${storesUrl}/${storeId}`, updateStoreData);
    return res.data;
  } catch (error) {
    toaster.showErrorToaster(error.message);
  }
}

async function deleteStore(storeId) {
  let ownerId;
  try {
    // Get the store details to find the ownerID
    const storeResponse = await axios.get(`${storesUrl}/${storeId}`);
    const storeData = storeResponse.data;
    ownerId = storeData.ownerID;
    // Delete the store
    await axios.delete(`${storesUrl}/${storeId}`);
  } catch (error) {
    toaster.showErrorToaster("Error deleting store: " + error.message);
  }
  try {
    // Get the owner's data
    const ownerResponse = await axios.get(`${ownerUrl}/${ownerId}`);
    const ownerData = ownerResponse.data;
    // Remove the store from the owner's stores array
    const updatedStores = ownerData.stores.filter((id) => id !== storeId);
    // Update the owner's data
    await axios.put(`${ownerUrl}/${ownerId}`, {
      ...ownerData,
      stores: updatedStores,
    });
    toaster.showSuccessToaster(
      `Store ${storeId} deleted and removed from owner ${ownerId}`
    );
  } catch (error) {
    toaster.showErrorToaster(
      "Error deleting store from owner: " + error.message
    );
  }
}

export async function getAllOwnerStores(ownersId) {
  try {
    const res = await axios.get(`${ownerUrl}/${ownersId}`);
    return res.data.stores;
  } catch (error) {
    toaster.showErrorToaster(error.message);
  }
}

function getLocalStores() {
  return allStores;
}

async function getOwnerStores(ownerId) {
  try {
    const res = await axios.get(`${storesUrl}/?ownerID=${ownerId}`);

    return extractStoreName(res.data);
  } catch (err) {
    toaster.showErrorToaster(err.message);
  }
}
function extractStoreName(array) {
  return array.map((obj) => obj["id"]);
}
async function updateOwnerStores(ownerId) {
  try {
    const userStores = await getOwnerStores(ownerId);

    try {
      await axios.patch(`${ownerUrl}/${ownerId}`, {
        stores: userStores,
      });
    } catch (err) {
      toaster.showErrorToaster(err.message);
    }
  } catch (err) {
    toaster.showErrorToaster(err.message);
  }
}

async function getOwnerByID(ownersId) {
  try {
    const res = await axios.get(`${ownerUrl}/?id=${ownersId}`);
    return res.data[0];
  } catch (err) {
    toaster.showErrorToaster(err.message);
  }
}

async function postComment(storeID, comment) {
  try {
    const store = await getStoreById(storeID);
    const commentsArr = store.comments;
    commentsArr.push(comment);
    await axios.patch(`${storesUrl}/${storeID}`, {
      comments: commentsArr,
    });
  } catch (err) {
    toaster.showErrorToaster(err.message);
  }
}

export const dbService = {
  getStore,
  getStoreById,
  postStore,
  updateStore,
  deleteStore,
  getAllOwnerStores,
  getOwnerByID,
  postComment,
  getUserIdFromURL,
  updateOwnerStores,
};
