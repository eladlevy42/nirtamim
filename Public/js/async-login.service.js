const storesUrl = "http://localhost:8001/stores";
const ownerUrl = "http://localhost:8001/owners";

async function userAuth(ev) {
  ev.preventDefault();
  const userPassword = document.querySelector("#passwordLog").value;
  const username = document.querySelector("#usernameLog").value;
  if (await matchUsernameToPassword(userPassword, username)) {
    window.location.href = `http://127.0.0.1:5500/Public/HTML/ownerStores.html?username=${encodeURIComponent(
      username
    )}`;
  } else {
    alert("incorrect username or password");
  }
}

async function getUserByUsername(username) {
  try {
    return await axios.get(`${ownerUrl}/?username=${username}`).data[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function matchUsernameToPassword(userPassword, username) {
  console.log(userPassword + " " + username);
  try {
    const res = await getUserByUsername(username);
    console.log(res);
    const user = res.data[0];
    console.log(user);
    if (user.password == userPassword) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
  }
}

//register
async function checkEmailExists(email) {
  try {
    const res = await axios.get(`${ownerUrl}/?email=${email}`);
    console.log(res.data[0]);
    if (res.data[0] == null) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
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
  console.log(username);
  console.log(await getUserByUsername(username));
  if ((await getUserByUsername(username)) != null) {
    alert("username already exists");
    return;
  }
  const password1 = document.querySelector("#passwordSign1").value;
  if (!checkPassword(password1)) {
    alert(
      "הסיסמה חייבת להיות באורך של לפחות 8 תווים, להכיל לפחות אות גדולה אחת, אות קטנה אחת, מספר אחד ותו מיוחד אחד."
    );
    return;
  }
  const password2 = document.querySelector("#passwordSign2").value;
  console.log(password1 + "" + password2);
  if (password1 != password2) {
    alert("passwords do not match");
    return;
  }
  const email = document.querySelector("#emailSign").value;
  console.log(email);
  console.log(await checkEmailExists(email));
  if (await checkEmailExists(email)) {
    alert("email already exists");
    return;
  }
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
  } catch {
    console.log(err);
  }
}

async function postOwner(owner) {
  try {
    await axios.post(ownerUrl, owner);
    console.log("owner posted");
    window.location.href = `http://localhost:3000/ownerStores.html?username=${encodeURIComponent(
      owner.username
    )}`;
  } catch (err) {
    throw err;
  }
}

function getUsernameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("username");
}

export const loginFunc = {
  getUserByUsername,
  matchUsernameToPassword,
  userAuth,
  checkPassword,
  checkEmailExists,
  registerUser,
  getUsernameFromURL,
  postOwner,
};
