async function postStore() {}
async function updateStore() {}
async function deleteStore() {}
async function getStoreById() {}
async function getAllOwnerStores() {}

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
const spinner = document.getElementById("spinner");

prevPageButton.addEventListener("click", () => changePage(-1));
nextPageButton.addEventListener("click", () => changePage(1));

async function getAllStores() {
  spinner.classList.remove("hidden");
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
    spinner.classList.add("hidden");
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
        `<div class="store">
      <img src="${store.img}" alt="${store.name}" class="store-image"/>
      <h4 class="store-name">${store.name}</h4>
      <p class="store-description">${store.details.description}</p>
      <p class="store-location">${store.location.district}, ${
          store.location.city
        }</p>
      <p class="store-phone">Phone: ${store.details["phone-number"]}</p>
      <p class="store-hours">Hours: ${store.details.hours}</p>
      <p class="store-categories">Categories: ${store.categories.join(", ")}</p>
      <p class="store-rating">Rating: ${store.comments.ratings} - ${
          store.comments.description
        } (${store.comments.name})</p>
      <a href="${store.details.link}" class="store-link">Visit Store</a>
    </div>`
    )
    .join("");

  const maxPage = Math.ceil(totalStores / storesPerPage);

  prevPageButton.classList.toggle("hidden", currentPage === 1);
  nextPageButton.classList.toggle(
    "hidden",
    currentPage === maxPage || totalStores <= storesPerPage
  );
  if (currentPage === 1) {
    pageNumberElement.classList.toggle("hidden");
  }

  if (maxPage <= 1) {
    prevPageButton.classList.add("hidden");
    nextPageButton.classList.add("hidden");
  }

  pageNumberElement.innerText = currentPage;
}

document
  .getElementById("searchStoreByName")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const searchQuery = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();
    if (!searchQuery) {
      await getAllStores();
      return;
    }

    spinner.classList.remove("hidden");
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
      spinner.classList.add("hidden");
    }
  });
