const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";

function getUsernameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("username");
}

export async function getStore() {
  try {
    const res = await axios.get(storesUrl);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getStoreById(storeId) {
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

export async function deleteStore(storeId) {
  try {
    const res = await axios.deleteStore(`${storesUrl}/${storeId}`);
    return res.data;
  } catch (error) {
    console.log(error);
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

////////// store

async function getOwnerByID(ownersId) {
  try {
    const res = await axios.get(`${ownerUrl}/${ownersId}`);
    return res.data;
  } catch (err) {
    console.error(err);
  }
}

async function postComment(storeID, comment) {
  try {
    const store = await getStoreById(storeID);
    console.log(store.comments);
    // get the store
    // update the array
    // patch
  } catch (err) {
    console.error(err);
  }
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
};
