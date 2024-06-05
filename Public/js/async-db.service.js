import { renderHTML } from "./renderHTML.service.js";

const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";

let currentPage = 1;
let allStores = [];
const storesPerPage = 9;
let totalStores = 0;
const displayStores = document.getElementById("displayStoreBySearch");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageNumberElement = document.getElementById("pageNumber");

async function getAllStores() {
  displayStores.innerHTML = "";
  displayStores.classList.add("hidden");

  try {
    const response = await axios.get(storesUrl);
    allStores = response.data;
    totalStores = allStores.length;
    if (totalStores === 0) {
      console.error("No stores found");
    } else {
      currentPage = 1;
      displayPage(allStores);
    }
  } catch (error) {
    console.error("Error fetching stores", error);
  } finally {
    displayStores.classList.remove("hidden");
  }
}

function changePage(direction) {
  const maxPage = Math.ceil(totalStores / storesPerPage);
  currentPage = Math.min(Math.max(currentPage + direction, 1), maxPage);
  displayPage(allStores);
}

function displayPage(stores) {
  const start = (currentPage - 1) * storesPerPage;
  const end = start + storesPerPage;
  const paginatedStores = stores.slice(start, end);

  displayStores.innerHTML = paginatedStores
    .map(
      (store) =>
        ` <div class="store-details">
      <h3> ${store.name}</h3>
      <p class="store-categories">${store.categories.join(", ")}</p>
      <div class="store__sub-details flex-group">
        <p class="store-rating">
          <i class="fa-solid fa-star filled"></i>
          <span class="rating">${store.comments}</span>
        </p>
        <p class="store-hours">Hours: ${store.details.hours}</p>
      </div>
    </div>
    `
    )
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
    console.error("Error searching stores", error);
  } finally {
    displayStores.classList.remove("hidden");
  }
};

function getUserIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("userId");
}

export async function getStore() {
  try {
    const res = await axios.get(storesUrl);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

async function getStoreById(storeId) {
  try {
    const res = await axios.get(`${storesUrl}/${storeId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function postStore(storeData) {
  try {
    await axios.post(storesUrl, storeData);
  } catch (error) {
    console.log(error);
  }
}

export async function updateStore(storeId, updateStoreData) {
  try {
    const res = await axios.put(`${storesUrl}/${storeId}`, updateStoreData);
    return res.data;
  } catch (error) {
    console.log(error);
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
    console.log("Error deleting store", error);
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
    console.log(`Store ${storeId} deleted and removed from owner ${ownerId}`);
  } catch (error) {
    console.log("Error deleting store from owner", error);
  }
}

export async function getAllOwnerStores(ownersId) {
  try {
    const res = await axios.get(`${ownerUrl}/${ownersId}`);
    return res.data.stores;
  } catch (error) {
    console.log(error);
  }
}

function getLocalStores() {
  return allStores;
}
export const storesFunc = {
  getStore,
  getStoreById,
  postStore,
  updateStore,
  deleteStore,
  getAllOwnerStores,
  getOwnerByID,
  postComment,
  getUserIdFromURL,
  search,
  changePage,
  updateOwner,
};
async function updateOwner(newOwner) {
  alert(newOwner);
  const id = newOwner.id;
  try {
    alert(`Owner ${newOwner}`);
    await axios.put(`${ownerUrl}/${id}`, newOwner);
  } catch (err) {
    alert(err);
    console.error(err);
  }
}

async function getOwnerByID(ownersId) {
  alert(`Owner ${ownersId}`);
  try {
    alert(`${ownerUrl}/?id=${ownersId}`);
    const res = await axios.get(`${ownerUrl}/?id=${ownersId}`);
    alert(res);
    return res.data;
  } catch (err) {
    alert(err);
    console.error(err);
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
    console.error(err);
  }
}
