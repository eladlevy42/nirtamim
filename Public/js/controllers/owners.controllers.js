import { loginFunc } from "../async-login.service.js";
import { dbService } from "../async-db.service.js";
import { newStoreFunctions } from "../owners.service.local.js";
//login and register
window.onload = onInit;

function onInit() {
  const loginFrm = document.getElementById("loginFrm");
  const registerFrm = document.getElementById("registerFrm");

  // Expose functions to the window object

  // Add event listener for the form submission

  loginFrm.addEventListener("submit", loginFunc.userAuth);
  registerFrm.addEventListener("submit", loginFunc.registerUser);
}
