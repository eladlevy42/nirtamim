const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";
import { toaster } from "/public/js/toast.sevice.js";

async function userAuth(ev) {
  ev.preventDefault();
  const userPassword = document.querySelector("#passwordLog").value;
  const username = document.querySelector("#usernameLog").value;
  if (await matchUsernameToPassword(userPassword, username)) {
    const user = await getUserByUsername(username);
    window.location.href = `http://127.0.0.1:5500/Public/HTML/ownerStores.html?userId=${encodeURIComponent(
      user.id
    )}`;
  } else {
    toaster.showErrorToast("incorrect username or password");
  }
}

// async function checkWordInPDF() {
//   const fileInput = document.getElementById("3010up");
//   const word = "3010";
//   const file = fileInput.files[0];

//   const arrayBuffer = await file.arrayBuffer();
//   const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

//   let text = "";
//   const pages = pdfDoc.getPages();
//   for (const page of pages) {
//     const textContent = await page.getTextContent();
//     text += textContent.items.map((item) => item.str).join(" ");
//   }
//   alert(text.includes(word));
//   return text.includes(word);
// }

async function getUserByUsername(username) {
  try {
    const response = await axios.get(`${ownerUrl}/?username=${username}`);
    return response.data[0];
  } catch (err) {
    toaster.showErrorToaster(err.message);
    return null;
  }
}

async function matchUsernameToPassword(userPassword, username) {
  try {
    const user = await getUserByUsername(username);

    if (user.password == userPassword) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    toaster.showErrorToaster(err.message);
  }
}

//register
async function checkEmailExists(email) {
  try {
    const res = await axios.get(`${ownerUrl}/?email=${email}`);

    if (res.data[0] == null) {
      return false;
    }
    return true;
  } catch (err) {
    toaster.showErrorToaster(err.message);
    return false;
  }
}

function checkPassword(password) {
  // Regular expressions for different character types
  const upperCaseRegExp = /[A-Z]/;
  const lowerCaseRegExp = /[a-z]/;
  const numberRegExp = /[0-9]/;
  const specialCharRegExp = /[!@#\$%\^\&*\)\(+=._-]/;
  const minLength = 8;

  // Check if the password meets the criteria
  if (password.length < minLength) {
    return false;
  }
  if (!upperCaseRegExp.test(password)) {
    return false;
  }
  if (!lowerCaseRegExp.test(password)) {
    return false;
  }
  if (!numberRegExp.test(password)) {
    return false;
  }
  if (!specialCharRegExp.test(password)) {
    return false;
  }

  // If all checks pass, the password is strong
  return true;
}

async function registerUser(ev) {
  ev.preventDefault();
  const username = document.querySelector("#usernameReg").value;

  if ((await getUserByUsername(username)) != null) {
    toaster.showErrorToast("שם משתמש כבר בשימוש ע''י משתמש אחר, בחר אחד חדש");

    return;
  }
  const password1 = document.querySelector("#passwordSign1").value;
  if (!checkPassword(password1)) {
    toaster.showErrorToast(
      "הסיסמה חייבת להיות באורך של לפחות 8 תווים, להכיל לפחות אות גדולה אחת, אות קטנה אחת, מספר אחד ותו מיוחד אחד."
    );
    return;
  }
  const password2 = document.querySelector("#passwordSign2").value;
  if (password1 != password2) {
    toaster.showErrorToast("סיסמאות אינן תואמות");

    return;
  }
  const email = document.querySelector("#emailSign").value;
  if (await checkEmailExists(email)) {
    toaster.showErrorToast('כתובת דוא"ל כבר בשימוש!');

    return;
  }
  // if (!checkWordInPDF()) {
  //   alert("file not 3010");
  //   return;
  // }
  const Name = document.querySelector("#ownerName").value;
  const desc = document.querySelector("#userAbout").value;
  const image = document.querySelector("#userImage").value;
  const newOwner = {
    name: Name,
    username: username,
    email: email,
    password: password1,
    description: desc,
    profileImg: image,
    stores: [],
  };
  try {
    await postOwner(newOwner);
  } catch (err) {
    toaster.showErrorToaster(err.message);
  }
}

async function postOwner(owner) {
  try {
    await axios.post(ownerUrl, owner);
    window.location.href = `http://localhost:8001/ownerStores.html?userId=${encodeURIComponent(
      owner.id
    )}`;
  } catch (err) {
    throw err;
  }
}

function getUserIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("userId");
}

export const loginFunc = {
  getUserByUsername,
  matchUsernameToPassword,
  userAuth,
  checkPassword,
  checkEmailExists,
  registerUser,
  getUserIdFromURL,
  postOwner,
};
