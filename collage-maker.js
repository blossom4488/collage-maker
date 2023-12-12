const url = "https://picsum.photos/v2/list?page=2&limit=100";
const box1 = document.querySelector(".box-1");
const box2 = document.querySelector(".box-2");
const box3 = document.querySelector(".box-3");

const alertShown = localStorage.getItem("alertShown");
if (!alertShown) {
  alert(
    "1. Select Three Images.\n 2. Send it to a friend.\n 3. If you want to leave, hit 'Exit'. All data will be cleared"
  );

  localStorage.setItem("alertShown", "true");
}

//Feature 1: Fetch requests to a 3rd party API
function displayRandomImage(boxElement) {
  fetch(url)
    .then(function (data) {
      return data.json();
    })
    .then((responseJson) => {
      const randomIndex = Math.floor(Math.random() * responseJson.length);
      const imageUrl = responseJson[randomIndex].download_url;
      const imgTag = document.createElement("img");
      imgTag.setAttribute("src", imageUrl);
      imgTag.style.width = "100%";
      imgTag.style.height = "100%";
      imgTag.style.objectFit = "cover";

      boxElement.innerHTML = "";
      boxElement.append(imgTag);
      localStorage.setItem(boxElement.classList[0], imageUrl);
    });
}

function displayImageFromLocalStorage(boxElement) {
  const imageUrl = localStorage.getItem(boxElement.classList[0]);
  if (imageUrl) {
    const imgTag = document.createElement("img");
    imgTag.setAttribute("src", imageUrl);
    imgTag.style.width = "100%";
    imgTag.style.height = "100%";
    imgTag.style.objectFit = "cover";
    boxElement.innerHTML = "";
    boxElement.append(imgTag);
  }
}

box1.addEventListener("click", () => {
  displayRandomImage(box1);
});

box2.addEventListener("click", () => {
  displayRandomImage(box2);
});

box3.addEventListener("click", () => {
  displayRandomImage(box3);
});

displayImageFromLocalStorage(box1);
displayImageFromLocalStorage(box2);
displayImageFromLocalStorage(box3);

const form = document.getElementById("form-container");
const sendBtn = document.querySelector(".send-btn");
const exitBtn = document.querySelector(".exit-btn");
const yourName = document.getElementById("your-name");
const friendName = document.getElementById("friend-name");
const email = document.getElementById("friends-email");
const message = document.getElementById("message");

//Feature 2:Sets, updates, or changes local storage
function setFormValues() {
  localStorage.setItem("yourName", yourName.value);
  localStorage.setItem("friendName", friendName.value);
  localStorage.setItem("email", email.value);
  localStorage.setItem("message", message.value);
}

function getFormValues() {
  yourName.value = localStorage.getItem("yourName") || "";
  friendName.value = localStorage.getItem("friendName") || "";
  email.value = localStorage.getItem("email") || "";
  message.value = localStorage.getItem("message") || "";
}
//Feature 3:Contains form fields, validates those fields
const validLength = (input, min) => {
  if (input.value.trim().length >= min) {
    input.parentElement.classList.remove("invalid");
    input.nextElementSibling.textContent = "";
  } else {
    input.parentElement.classList.add("invalid");
    input.nextElementSibling.textContent = `Please enter at least ${min} characters.`;
  }
};

const validEmail = (input) => {
  const emailFormat = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})$/;

  if (emailFormat.test(input.value.trim())) {
    input.parentElement.classList.remove("invalid");
    input.nextElementSibling.textContent = "";
  } else {
    input.parentElement.classList.add("invalid");
    input.nextElementSibling.textContent = "Please enter a valid email.";
  }
};

const validMessage = (input, min) => {
  if (input.value.trim().length >= min) {
    input.parentElement.classList.remove("invalid");
    input.nextElementSibling.textContent = "";
  } else {
    input.parentElement.classList.add("invalid");
    input.nextElementSibling.textContent = `Please enter at least ${min} characters.`;
  }
};

sendBtn.addEventListener("click", (e) => {
  e.preventDefault();
  validLength(yourName, 2);
  validLength(friendName, 2);
  validEmail(email);
  validMessage(message, 5);

  if (
    !box1.querySelector("img") ||
    !box2.querySelector("img") ||
    !box3.querySelector("img")
  ) {
    alert("Three Images are required before hitting send");
  }

  const inputs = [yourName, friendName, email, message];
  const hasValidationError = inputs.some((input) =>
    input.parentElement.classList.contains("invalid")
  );

  if (
    !hasValidationError &&
    box1.querySelector("img") &&
    box2.querySelector("img") &&
    box3.querySelector("img")
  ) {
    moveImageUp();
  }
});
function moveImageUp() {
  const movingImage = document.getElementById("email-sent");
  const moveDistance = window.innerHeight - movingImage.clientHeight;
  movingImage.style.top = "0px";

  //Feature 4: Timing functions
  setTimeout(() => {
    const boxes = [box1, box2, box3];
    boxes.forEach((box, index) => {
      localStorage.removeItem(box.classList[0]);
      box.innerHTML = `<p>${index + 1}</p>`;
    });
    localStorage.removeItem("yourName");
    localStorage.removeItem("friendName");
    localStorage.removeItem("email");
    localStorage.removeItem("message");
    yourName.value = "";
    friendName.value = "";
    email.value = "";
    message.value = "";

    movingImage.style.top = "1000px";
  }, 4000);
}

exitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const formGroups = document.querySelectorAll(".form-group");
  formGroups.forEach((element) => {
    element.classList.remove("invalid");
    const pTag = element.querySelector("p");
    pTag.textContent = "";
  });

  const boxes = [box1, box2, box3];
  boxes.forEach((box, index) => {
    localStorage.removeItem(box.classList[0]);
    box.innerHTML = `<p>${index + 1}</p>`;
  });
  yourName.value = "";
  friendName.value = "";
  email.value = "";
  message.value = "";
  localStorage.clear();
});

window.addEventListener("load", getFormValues);

window.addEventListener("beforeunload", setFormValues);
