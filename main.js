
// ==========================================
// SENTRIXA - Advanced Main Frontend JavaScript
// ==========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // 1. Mobile Navigation
    // ======================================

    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".header nav");

    if (menuToggle && navigation) {

        const openMenu = () => {
            navigation.classList.add("active");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.innerHTML = "✕";
            document.body.classList.add("menu-open");
        };

        const closeMenu = () => {
            navigation.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.innerHTML = "☰";
            document.body.classList.remove("menu-open");
        };

        const toggleMenu = () => {
            const isOpen = navigation.classList.contains("active");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Toggle navigation");
        menuToggle.setAttribute("type", "button");

        menuToggle.addEventListener("click", toggleMenu);

        // Close after clicking a navigation link
        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Close when clicking outside
        document.addEventListener("click", event => {

            const isOpen = navigation.classList.contains("active");

            if (
                isOpen &&
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }

        });

        // Close with Escape key
        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        // Close menu when screen becomes desktop
        window.addEventListener("resize", () => {

            if (window.innerWidth > 768) {
                closeMenu();
            }

        });

    }

    // ======================================
    // 2. Smooth Scrolling
    // ======================================

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            let target;

            try {
                target = document.querySelector(targetId);
            } catch {
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
    // 3. Automatic Current Year
    // ======================================

    const yearElement = document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ======================================
    // 4. Header Scroll Effect
    // ======================================

    const header = document.querySelector(".header");

    if (header) {

        const updateHeader = () => {
            header.classList.toggle("scrolled", window.scrollY > 50);
        };

        updateHeader();

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });

    }

    // ======================================
    // 5. Back To Top Button
    // ======================================

    const backToTop = document.querySelector("#back-to-top");

    if (backToTop) {

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });

        });

        window.addEventListener("scroll", () => {

            backToTop.classList.toggle(
                "visible",
                window.scrollY > 400
            );

        }, { passive: true });

    }

    // ======================================
    // 6. External Links Security
    // ======================================

    document.querySelectorAll('a[target="_blank"]').forEach(link => {

        link.setAttribute("rel", "noopener noreferrer");

    });

    // ======================================
    // 7. Application Initialization
    // ======================================

    console.log(
        "%c SENTRIXA ",
        "background:#00d9ff;color:#07111f;font-size:18px;font-weight:bold;padding:8px;"
    );

    console.log("Frontend Initialized Successfully");

});
