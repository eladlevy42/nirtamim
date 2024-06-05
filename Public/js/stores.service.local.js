import { dbService } from "./async-db.service.js";

const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";
let currentPage = 1;
let allStores = [];
const storesPerPage = 9;
let totalStores = 0;
const storesContainer = document.querySelector("#allStoresContainer");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const pageNumberElement = document.getElementById("pageNumber");

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
                  <span class="rating">${calculateAvgRating(
                    store.comments
                  )}</span>
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
async function getAllStores() {
  storesContainer.innerHTML = "";
  storesContainer.classList.add("hidden");
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
    storesContainer.classList.remove("hidden");
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

const search = async function () {
  const searchQuery = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (!searchQuery) {
    await getAllStores();
    return;
  }

  storesContainer.innerHTML = "";
  storesContainer.classList.add("hidden");

  try {
    const response = await axios.get(storesUrl);
    allStores = response.data.filter((store) =>
      store.name.toLowerCase().includes(searchQuery)
    );

    totalStores = allStores.length;
    if (totalStores === 0) {
      storesContainer.innerHTML = "<p>No stores found</p>";
    } else {
      currentPage = 1;
      displayPage(allStores);
    }
  } catch (error) {
    console.error("Error searching stores", error);
  } finally {
    storesContainer.classList.remove("hidden");
    // spinner.classList.add("hidden");
  }
};

export const storeService = {
  search,
  changePage,
  displayPage,
  calculateAvgRating,
  getAllStores,
};
