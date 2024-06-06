import { dbService } from "./async-db.service.js";
const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";
let currentPage = 0;

let allRelevantStores = [];
const storesPerPage = 10;
let totalStores = 0;
const storesContainer = document.querySelector("#allStoresContainer");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageNumberElement = document.getElementById("pageNumber");
let filteredByDistrict;
let filteredByCategory;
let filteredByCity;

// filter by category
const categoryFilterOption = document.querySelectorAll(".category-option");
categoryFilterOption.forEach((categoryOption) => {
  categoryOption.addEventListener("click", async (event) => {
    currentPage = 0;
    const category = event.target.innerText.trim();
    filteredByCategory = category;
    await resetCategoryFilter();
    await filterByCategory(category);
    displayStores();
  });
});
async function resetCategoryFilter() {
  if (filteredByCategory) {
    allRelevantStores = await dbService.getAllStores();
  }
}
async function filterByCategory(category) {
  try {
    allRelevantStores = allRelevantStores.filter((store) => {
      return store.categories.includes(category);
    });
  } catch (err) {
    console.error(err);
  }
}
// filter by district
const districtFilterOption = document.querySelectorAll(".district-option");
districtFilterOption.forEach((districtOption) => {
  districtOption.addEventListener("click", async (event) => {
    currentPage = 0;
    const district = event.target.getAttribute("data-value");
    filteredByDistrict = district;
    await resetDistrictFilter();
    await filterByDistrict(district);
    displayStores();
  });
});
async function resetDistrictFilter() {
  if (filterByDistrict) {
    allRelevantStores = await dbService.getAllStores();
  }
}
async function filterByDistrict(district) {
  try {
    allRelevantStores = allRelevantStores.filter((store) => {
      return district === store.location.district;
    });
  } catch (err) {
    console.error(err);
  }
}

// filter by city
const cityFilterOption = document.querySelectorAll(".city-option");
cityFilterOption.forEach((cityOption) => {
  cityOption.addEventListener("click", async (event) => {
    currentPage = 0;
    const city = event.target.innerText.trim();
    filteredByCity = city;
    await resetCityFilter();
    await filterByCity(city);
    displayStores();
  });
});
async function resetCityFilter() {
  if (filteredByCity) {
    allRelevantStores = await dbService.getAllStores();
  }
}
async function filterByCity(city) {
  try {
    allRelevantStores = allRelevantStores.filter(
      (store) => city === store.location.city
    );
  } catch (err) {
    console.error(err);
  }
}

function openStorePage(storeId) {
  window.location.href = `http://127.0.0.1:5500/Public/HTML/store.html?storeId=${storeId}`;
}
// pagination
// pull all, insert to the allRelevant first
// get the first 10, update current page
function displayPage(stores) {
  const start = (currentPage - 1) * storesPerPage;
  const end = start + storesPerPage;
  const paginatedStores = stores.slice(start, end);
  storesContainer.innerHTML = paginatedStores
    .map((store) => {
      return `<div class="store-card grid-group"  id="${store.id}">
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
                    <span class="rating">${calculateAvgRating(
                      store.comments
                    )}</span>
                  </p>
              </div>
            </div>`;
    })
    .join("");
  paginatedStores.forEach((store) => {
    const storeElement = document.getElementById(`${store.id}`);
    storeElement.addEventListener("click", () => openStorePage(store.id));
  });
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
async function displayStores() {
  storesContainer.innerHTML = "";
  let startStoreIndex = storesPerPage * currentPage;
  const endStoreIndex = storesPerPage * (currentPage + 1);
  const flagIndex =
    endStoreIndex > allRelevantStores.length
      ? allRelevantStores.length
      : endStoreIndex;
  displayPaginationButtons();
  while (startStoreIndex < flagIndex) {
    const element = allRelevantStores[startStoreIndex];
    storesContainer.innerHTML += renderStoreElement(element);
    startStoreIndex++;
  }
  document.querySelectorAll(".store-card").forEach((storeCard) => {
    storeCard.addEventListener("click", (event) => {
      const cardId = event.currentTarget.id;
      openStorePage(cardId);
    });
  });
}

function isCurrentTimeInRange(timeRange) {
  const [startTime, endTime] = timeRange.split("-");
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);
  const startTimeInMinutes = startHours * 60 + startMinutes;
  const endTimeInMinutes = endHours * 60 + endMinutes;

  if (startTimeInMinutes <= endTimeInMinutes) {
    return currentTime >= startTimeInMinutes && currentTime <= endTimeInMinutes;
  } else {
    return currentTime >= startTimeInMinutes || currentTime <= endTimeInMinutes;
  }
}
function coloredHours(timeRange) {
  return isCurrentTimeInRange(timeRange) ? "open-hours" : "close-hours";
}
function renderStoreElement(storeObject) {
  return `<div class="store-card grid-group" id="${storeObject.id}">
              <div class="store-img__wrapper flex-group">
              <img
                      class="store-img"
                      src="${storeObject.img}"
                      alt="${storeObject.name}"
                  />
              </div>
              <div class="store-details">
                <h3>${storeObject.name}</h3>
                <div class="group-details flex-group">
                  <p class="store-categories">${storeObject.categories.join(
                    ", "
                  )}</p>
                </div>
                <div class="store__sub-details flex-group">
                  <p class="store-hours ${coloredHours(
                    storeObject.details.hours
                  )}">${storeObject.details.hours}</p>
                  <p class="store-location">
                    <span class="city">${
                      storeObject.location.city
                    }</span>,<span class="district"
                      >${storeObject.location.district}
                  </p>
                </div>
                <p class="store-rating">
                    <i class="fa-solid fa-star filled"></i>
                    <span class="rating">${calculateAvgRating(
                      storeObject.comments
                    )}</span>
                  </p>
              </div>
            </div>`;
}
async function displayAllStores() {
  storesContainer.innerHTML = "";
  storesContainer.classList.add("hidden");
  try {
    const response = await axios.get(storesUrl);
    allRelevantStores = response.data;
    totalStores = allRelevantStores.length;
    if (totalStores === 0) {
      console.error("No stores found");
    } else {
      currentPage = 1;
      displayPage(allRelevantStores);
    }
  } catch (error) {
    console.error("Error fetching stores", error);
  } finally {
    storesContainer.classList.remove("hidden");
  }
}
function displayPaginationButtons(params) {
  // next
  if (
    allRelevantStores.length === 0 ||
    (currentPage + 1) * storesPerPage > allRelevantStores.length
  ) {
    document.querySelector("#nextPage").style.visibility = "hidden";
  } else {
    document.querySelector("#nextPage").style.visibility = "visible";
  }
  // prev
  if (allRelevantStores.length === 0 || currentPage === 0) {
    document.querySelector("#prevPage").style.visibility = "hidden";
  } else {
    document.querySelector("#prevPage").style.visibility = "visible";
  }
}
document.getElementById("nextPage").addEventListener("click", () => {
  nextPage();
});
document.getElementById("prevPage").addEventListener("click", () => {
  prevPage();
});
function nextPage() {
  currentPage++;
  displayStores();
}
function prevPage() {
  currentPage--;
  displayStores();
}

function changePage(direction) {
  const maxPage = Math.ceil(totalStores / storesPerPage);
  currentPage = Math.min(Math.max(currentPage + direction, 1), maxPage);
  displayPage(allRelevantStores);
}

function calculateAvgRating(commentsArray) {
  const total = commentsArray.reduce((acc, comment) => {
    acc += Number(comment.ratings);
    return acc;
  }, 0);
  return (total / commentsArray.length).toFixed(1);
}

const search = async function () {
  const searchQuery = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (!searchQuery) {
    await displayAllStores();
    return;
  }

  storesContainer.innerHTML = "";
  storesContainer.classList.add("hidden");

  try {
    const response = await axios.get(storesUrl);
    allRelevantStores = response.data.filter((store) =>
      store.name.toLowerCase().includes(searchQuery)
    );

    totalStores = allRelevantStores.length;
    if (totalStores === 0) {
      storesContainer.innerHTML = "<p>No stores found</p>";
    } else {
      currentPage = 0;
      displayStores();
    }
  } catch (error) {
    console.error("Error searching stores", error);
  } finally {
    storesContainer.classList.remove("hidden");
    // spinner.classList.add("hidden");
  }
};
async function resetLocalStore() {
  try {
    allRelevantStores = await dbService.getAllStores();
  } catch (err) {
    console.error(err);
  }
}

export const storeService = {
  search,
  changePage,
  displayPage,
  calculateAvgRating,
  displayAllStores,
  displayStores,
  resetLocalStore,
  nextPage,
  prevPage,
  displayPaginationButtons,
};
