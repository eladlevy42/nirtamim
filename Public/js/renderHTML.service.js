import { dbService } from "./async-db.service.js";
import { toaster } from "./toast.sevice.js";

function renderStoreUsers() {
  const allStores = dbService.getLocalStores();
  return allStores
    .map(
      (store) =>
        `<div class="store-card grid-group">
      <div class="store-img__wrapper flex-group">
            <img onerror="this.onerror=null; this.src='https://www.svgrepo.com/show/508699/landscape-placeholder.svg';"
              class="store-img"
              src="${store.img}" alt="${store.name}"
            />
          </div>
      <div class="store-details">
      <h3>${store.name}</h3>
      <p class="store-categories">${store.categories.join(", ")}</p>
      <div class="store__sub-details flex-group">
      <p class="store-rating">
        <i class="fa-solid fa-star filled"></i>
        <span class="rating">${store.comments.ratings}</span>
      </p>
      <p class="store-hours">${store.details.hours}</p>
      </div>
      </div>
      </div>`
    )
    .join("");
}
function renderStoreForOwners() {
  const allStores = dbService.getLocalStores();
  return allStores
    .map(
      (store) =>
        `<div class="store">
      <button onclick="editBook(this)" class="edit" id="editButton">
      <button onclick="deleteBook(this)" class="delete" id="DeleteButton">
      <img onerror="this.onerror=null; this.src='https://www.svgrepo.com/show/508699/landscape-placeholder.svg';" src="${
        store.img
      }" alt="${
          store.name
        }"                 onerror="this.onerror=null; this.src='https://www.svgrepo.com/show/508699/landscape-placeholder.svg';" class="store-image"/>
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
}

function renderComments(comments) {
  console.log(comments[1]);
  return comments
    .map(
      (comment) =>
        `<div class="review">
    <h4>${comment.name}</h4>
    <span class="reviewRating">
      <i class="fa-solid fa-star"></i>${comment.ratings} 
    </span>
    <p class="reviewParagraph">${comment.description}</p>
  </div>`
    )
    .join("");
}

async function renderSpecificStore(store) {
  try {
    const owner = await dbService.getOwnerByID(store.ownerID);
    return `<h1>${store.name}</h1>
  <div class="store-container grid-group">
    <div class="store-wrapper">
      <div class="store-img">
        <img                 onerror="this.onerror=null; this.src='https://www.svgrepo.com/show/508699/landscape-placeholder.svg';"
          src=${store.img}
          alt="${store.name}"
        />
      </div>
      <div class="store-details flex-group">
        <div class="storeDataContainer">
          <div class="categories-container">
            <h4>קטגוריה:</h4>
            <p class="categories">${store.categories}</p>
          </div>
          <div class="rating-container">
            <h4>דירוג:</h4>
            <p class="flex-group">
              <i class="fa-solid fa-star filled"></i>
              <span class="rating">${dbService.calculateAvgRating(
                store.comments
              )}</span>
            </p>
          </div>
          <div id="storeAdress" class="address">
            <span class="city">${store.location.city}</span>,
            <span class="address">${store.location.district}</span>
            
          </div>
          <span>שעות עבודה: ${store.details.hours}</span>
          <div id="storeLinks">
            <a href="${store.details.link}" class="store__website"
              ><i class="fa-solid fa-house-user"></i
            ></a>
            <a href="${store.details.phone}" class="store__phone-number"
              ><i class="fa-solid fa-phone"></i
            ></a>
          </div>
        </div>
      </div>
      <div class="reviews-container">
        <div id="allReviews">
         ${renderComments(store.comments)}
        </div>
        <div class="add-review__wrapper flex-group">
          <button id="addNewComment" class="btn">
            <i class="fa-solid fa-plus"></i>
          </button>
          <p>הוסף תגובה חדשה</p>
        </div>
      </div>
    </div>
    <div class="about-user-wrapper">
      <div class="container">
        <div class="leftStoreContainer">
          <h2>על הבעלים:</h2>
          <div class="aboutMeContainer">
            <p id="ownerDescription">
            ${owner.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  } catch (err) {
    toaster.showErrorToast(err.message);
  }
}
export const renderHTML = {
  renderStoreUsers,
  renderStoreForOwners,
  renderComments,
  renderSpecificStore,
};
