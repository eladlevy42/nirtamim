async function renderSpecificStore(store) {
  try {
    const owner = await dbService.getOwnerByID(store.ownerID);
    return `<h1>${store.name}</h1>
    <div class="store-container grid-group">
      <div class="store-wrapper">
        <div class="store-img">
          <img
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
            <div id="storeLinks">
              <a href="${store.details.link}" class="store__website"
                ><i class="fa-solid fa-house-user"></i
              ></a>
              <a href="${store.details.phone}" class="store__phone-number"
                ><i class="fa-solid fa-phone"></i
              ></a>
              <!-- <i class="fa-solid fa-pen-to-square"></i> -->
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
