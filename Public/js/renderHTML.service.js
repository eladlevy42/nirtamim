import { storesFunc } from "./async-db.service.js";

function renderStoreUsers() {
  const allStores = storesFunc.getLocalStores();
  return allStores
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
}

function renderStoreForOwners() {
  const allStores = storesFunc.getLocalStores();
  return allStores
    .map(
      (store) =>
        `<div class="store">
      <button onclick="editBook(this)" class="edit" id="editButton">
      <button onclick="deleteBook(this)" class="delete" id="DeleteButton">
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
}

function renderComments() {
  return `<div class="review">
    <h4>/h4>
    <span class="reviewRating">
      <i class="fa-solid fa-star"></i> 
    </span>
    <p class="reviewParagraph"></p>
  </div>`;
}

export const renderHTML = {
  renderStoreUsers,
  renderStoreForOwners,
  renderComments,
};
