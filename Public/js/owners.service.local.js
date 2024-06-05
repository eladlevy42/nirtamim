function getUserIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("userId");
}
function getNewStoreData() {
  const form = document.querySelector("#addStoreFrm");
  const formData = new FormData(form);
  const categoriesArray = formData
    .get("categories")
    .split(",")
    .map((item) => item.trim());
  const newStore = {
    name: formData.get("name"),
    ownerID: getUserIdFromURL(),
    categories: categoriesArray,
    location: {
      district: formData.get("district"),
      city: formData.get("city"),
    },
    img: formData.get("img"),
    comments: [],
    details: {
      "phone-number": formData.get("phoneNumber"),
      hours: formData.get("hours"),
      description: formData.get("storeDescription"),
      link: formData.get("link"),
    },
  };
  return newStore;
}

export const newStoreFunctions = { getNewStoreData, getUserIdFromURL };
