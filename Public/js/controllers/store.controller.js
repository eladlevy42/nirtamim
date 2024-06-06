import { renderHTML } from "../renderHTML.service.js";
import { dbService } from "../async-db.service.js";
const storesUrl = "http://localhost:8001/stores";
const usersUrl = "http://localhost:8001/users";

window.onload = onInit;

async function onInit() {
  // Expose functions to the window object
  window.onPageLoad = onPageLoad;
  const storeId = dbService.getStoreIdFromURL();
  const store = await dbService.getStoreById(storeId);
  onPageLoad(store);
}

async function onPageLoad(store) {
  document.querySelector("main").innerHTML =
    await renderHTML.renderSpecificStore(store);

  document
    .querySelector("#feedbackForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log(selectedRating);
      const comment = {
        name: document.querySelector("#name").value,
        description: document.querySelector("#message").value,
        ratings: selectedRating,
      };
      console.log(comment);
      await dbService.postComment(store.id, comment);
      newStore = await dbService.getStoreById(store.id);
      document.querySelector("#allReviews").innerHTML =
        renderHTML.renderAllReviews(newStore.comment);
      document.querySelector(".overlay").style.display = "none";
    });

  const stars = document.querySelectorAll(".star-rating .fa-star");
  let selectedRating = 0;

  stars.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const starId = parseInt(this.id);
      fillStars(starId);
    });

    star.addEventListener("mouseout", function () {
      resetStars();
      if (selectedRating > 0) {
        fillStars(selectedRating);
      }
    });

    star.addEventListener("click", function () {
      selectedRating = parseInt(this.id);
      fillStars(selectedRating);
    });
  });

  function fillStars(starId) {
    stars.forEach((star) => {
      if (parseInt(star.id) <= starId) {
        star.style.color = "hsl(60, 100%, 40%)";
      } else {
        star.style.color = "#ccc";
      }
    });
  }

  function resetStars() {
    stars.forEach((star) => {
      star.style.color = "#ccc";
    });
  }
  document
    .querySelector(".close-overlay")
    .addEventListener("click", (event) => {
      event.target.parentElement.style.display = "none";
      document.querySelector(".overlay").style.display = "none";
    });
  if (document.querySelector("#addNewComment")) {
    document.querySelector("#addNewComment").addEventListener("click", () => {
      document.querySelector(".pop-up__container").style.display = "block";
      document.querySelector(".overlay").style.display = "block";
    });
  }
}
