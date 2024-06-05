const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";

function getUsernameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("userId");
}

export async function getStore() {
  try {
    const res = await axios.get(storesUrl);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

export async function getStoreById(storeId) {
  try {
    const res = await axios.get(`${storesUrl}/${storeId}`);
    console.log(res.data);
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
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteStore(storeId) {
  try {
    const res = await axios.deleteStore(`${storesUrl}/${storeId}`);
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
}

export async function getAllOwnerStores(ownersId) {
  try {
    const res = await axios.get(`${ownerUrl}/${ownersId}`);
    console.log(res.data.stores);
  } catch (error) {
    console.log(error);
  }
}

export const storesFunc = {
  getStore,
  getStoreById,
  postStore,
  updateStore,
  deleteStore,
  getAllOwnerStores,
};

////////// userLogIn
