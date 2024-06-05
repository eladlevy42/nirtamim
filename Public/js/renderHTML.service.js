import { storesFunc } from "./async-db.service.js";

function renderStoreUsers() {
  const allStores = storesFunc.getLocalStores();
  return allStores
    .map(
      (store) =>
        `<div class="store-card grid-group">
      <div class="store-img__wrapper flex-group">
            <img
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
    //   <p class="store-location">${store.location.district}, ${
    //       store.location.city
    //     }</p>
    //   <p class="store-phone">Phone: ${store.details["phone-number"]}</p>
    //   <p class="store-hours">Hours: ${store.details.hours}</p>
    //   <p class="store-categories">Categories: ${store.categories.join(", ")}</p>
    //   <p class="store-rating">Rating: ${store.comments.ratings} - ${
    //       store.comments.description
    //     } (${store.comments.name})</p>
    //   <a href="${store.details.link}" class="store-link">Visit Store</a>
    // </div>`
    )
    .join("");
}
{
  /* <div class="store-card grid-group">
          <div class="store-img__wrapper flex-group">
            <img
              class="store-img"
              src="https://d3o5sihylz93ps.cloudfront.net/wp-content/uploads/2021/06/17100511/cc-1100x733.jpg"
              alt=""
            />
          </div>
          <div class="store-details">
            <h3>/h3>
            <p class="store-categories">בר, מסעדה</p>
            <div class="store__sub-details flex-group">
              <p class="store-rating">
                <i class="fa-solid fa-star filled"></i>
                <span class="rating">4.5</span>
              </p>
              <p class="store-hours">14:00-22:00</p>
            </div>
          </div>
        </div> */
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
