
// SENTRIXA JavaScript

console.log("SENTRIXA Website Started Successfully!");

const servicesButton = document.querySelector(".hero button");

servicesButton.addEventListener("click", function () {
    document.querySelector("#services").scrollIntoView({
        behavior: "smooth"
    });
});

console.log("SENTRIXA Services Loaded Successfully!");
