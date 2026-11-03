// SENTRIXA - Main Frontend JavaScript

document.addEventListener("DOMContentLoaded", () => {

    // Mobile Navigation
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".header nav");

    if (menuToggle && navigation) {

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.innerHTML = isOpen ? "✕" : "☰";

        });

        // Close Menu After Clicking a Link
        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navigation.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.innerHTML = "☰";

            });

        });

    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

    // Current Year
    const yearElement = document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    console.log("SENTRIXA Frontend Initialized Successfully");

});