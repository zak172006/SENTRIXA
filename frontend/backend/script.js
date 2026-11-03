
// SENTRIXA - Main JavaScript

console.log("SENTRIXA Website Started Successfully!");

// Welcome Message
function showWelcome() {
    alert("مرحباً بك في SENTRIXA - عالم الأمن السيبراني");
}

// Services Button
const servicesButton = document.querySelector(".hero button");

servicesButton.addEventListener("click", function () {
    showWelcome();
});
