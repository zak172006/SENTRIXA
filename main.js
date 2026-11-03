

"use strict";

// ==========================================
// SENTRIXA - Professional Frontend Controller
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // 1. Global Elements
    // ======================================

    const header = document.querySelector(".header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".header nav");
    const yearElement = document.querySelector("#current-year");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // ======================================
    // 2. Mobile Navigation
    // ======================================

    if (menuToggle && navigation) {

        const openMenu = () => {

            navigation.classList.add("active");

            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "إغلاق القائمة");
            menuToggle.textContent = "✕";

            document.body.classList.add("menu-open");

        };

        const closeMenu = () => {

            navigation.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "فتح القائمة");
            menuToggle.textContent = "☰";

            document.body.classList.remove("menu-open");

        };

        menuToggle.addEventListener("click", () => {

            const isOpen = navigation.classList.contains("active");

            isOpen ? closeMenu() : openMenu();

        });

        // Close after clicking a link

        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMenu);

        });

        // Close when clicking outside

        document.addEventListener("click", event => {

            if (!navigation.classList.contains("active")) return;

            if (
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                closeMenu();

            }

        });

        // Close using Escape

        document.addEventListener("keydown", event => {

            if (
                event.key === "Escape" &&
                navigation.classList.contains("active")
            ) {

                closeMenu();
                menuToggle.focus();

            }

        });

        // Match CSS mobile breakpoint

        window.addEventListener("resize", () => {

            if (window.innerWidth > 650) {
                closeMenu();
            }

        });

    }

    // ======================================
    // 3. Smooth Scrolling
    // ======================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            let target;

            try {

                target = document.querySelector(targetId);

            } catch (error) {

                console.warn("Invalid navigation target:", targetId);
                return;

            }

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({

                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"

            });

        });

    });

    // ======================================
    // 4. Automatic Current Year
    // ======================================

    if (yearElement) {

        yearElement.textContent = new Date().getFullYear();

    }

    // ======================================
    // 5. Header Scroll Effect
    // ======================================

    if (header) {

        const updateHeader = () => {

            header.classList.toggle(
                "scrolled",
                window.scrollY > 50
            );

        };

        updateHeader();

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });

    }

    // ======================================
    // 6. External Links Security
    // ======================================

    document.querySelectorAll('a[target="_blank"]').forEach(link => {

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });

    // ======================================
    // 7. Keyboard Accessibility
    // ======================================

    document.querySelectorAll("button").forEach(button => {

        if (!button.hasAttribute("type")) {

            button.setAttribute("type", "button");

        }

    });

    // ======================================
    // 8. Application Initialization
    // ======================================

    console.log(
        "%c SENTRIXA ",
        "background:#00e5ff;color:#050b16;font-size:20px;font-weight:bold;padding:10px;"
    );

    console.log("Cyber Security Frontend Initialized Successfully");

    console.log("Navigation System: Ready");
    console.log("Smooth Scrolling: Ready");
    console.log("Responsive Layout: Ready");

});
