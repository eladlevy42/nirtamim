import { renderHTML } from "./renderHTML.service.js";
import { toaster } from "./toast.sevice.js";
const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";

const displayStores = document.getElementById("displayStoreBySearch");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageNumberElement = document.getElementById("pageNumber");

////////////

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

async function getAllStores() {
  try {
    const res = await axios.get(storesUrl);
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

async function getOwnerStores(ownerId) {
  try {
    const res = await axios.get(`${storesUrl}/?ownerID=${ownerId}`);
    alert(res.data);
    return extractStoreName(res.data);
  } catch (err) {
    alert(err);
    console.error(err);
  }
}
function extractStoreName(array) {
  return array.map((obj) => obj["id"]);
}
async function updateOwnerStores(ownerId) {
  try {
    const userStores = await getOwnerStores(ownerId);
    alert(userStores);
    try {
      await axios.patch(`${ownerUrl}/${ownerId}`, {
        stores: userStores,
      });
      alert("Updated");
    } catch (err) {
      alert(err);
    }
  } catch (err) {
    alert(err);
    console.error(err);
  }
}
async function getOwnerByID(ownersId) {
  try {
    const res = await axios.get(`${ownerUrl}/?id=${ownersId}`);
    return res.data[0];
  } catch (err) {
    alert(err);
    console.error(err);
  }
}
function calculateAvgRating(commentsArray) {
  if (commentsArray.length > 0) {
    const total = commentsArray.reduce((acc, comment) => {
      acc += Number(comment.ratings);
      return acc;
    }, 0);
    return (total / commentsArray.length).toFixed(1);
  }
  return 0;
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
function getStoreIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("storeId");
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
  getAllStores,
  calculateAvgRating,
  getStoreIdFromURL,
};
