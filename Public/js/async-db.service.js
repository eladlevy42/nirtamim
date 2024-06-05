const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";

function getUsernameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("username");
}

async function postStore() {}
async function updateStore() {}
async function deleteStore() {}
async function getStoreById() {}
async function getAllOwnerStores() {}

////////// userLogIn
