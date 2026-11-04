
"use strict";

// ==========================================
// SENTRIXA - Professional Frontend Controller
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. Global Elements
    const header = document.querySelector(".header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".header nav");
    const yearElement = document.querySelector("#current-year");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // 2. Mobile Navigation
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
            navigation.classList.contains("active")
                ? closeMenu()
                : openMenu();
        });

        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", event => {
            if (
                navigation.classList.contains("active") &&
                !navigation.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", event => {
            if (
                event.key === "Escape" &&
                navigation.classList.contains("active")
            ) {
                closeMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 650) {
                closeMenu();
            }
        });
    }

    // 3. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    // 4. Automatic Current Year
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 5. Header Scroll Effect
    if (header) {

        const updateHeader = () => {
            header.classList.toggle("scrolled", window.scrollY > 50);
        };

        updateHeader();

        window.addEventListener("scroll", updateHeader, {
            passive: true
        });
    }

    // 6. External Links Security
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.setAttribute("rel", "noopener noreferrer");
    });

    // 7. Keyboard Accessibility
    document.querySelectorAll("button").forEach(button => {
        if (!button.hasAttribute("type")) {
            button.setAttribute("type", "button");
        }
    });

    // 8. SMART SEARCH
    const searchForm = document.getElementById("siteSearch");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    // الخدمات الحقيقية الموجودة في index.html
    const services = [
        {
            name: "حماية المواقع",
            id: "service-website",
            keywords: ["حماية المواقع", "المواقع", "website", "web"]
        },
        {
            name: "الفحص الأمني",
            id: "service-scan",
            keywords: [
                "الفحص الأمني",
                "اختبار الاختراق",
                "الاختراق",
                "فحص",
                "penetration testing"
            ]
        },
        {
            name: "حماية البيانات",
            id: "service-data",
            keywords: ["حماية البيانات", "البيانات", "data"]
        },
        {
            name: "مراقبة التهديدات",
            id: "service-monitoring",
            keywords: [
                "مراقبة التهديدات",
                "التهديدات",
                "الهجمات",
                "cyber threats"
            ]
        },
        {
            name: "التقارير الأمنية",
            id: "service-reports",
            keywords: ["التقارير الأمنية", "التقارير", "reports"]
        },
        {
            name: "التوعية الأمنية",
            id: "service-awareness",
            keywords: ["التوعية الأمنية", "التوعية", "أمن المعلومات", "awareness"]
        }
    ];

    if (searchForm && searchInput && searchResults) {

        // تنفيذ البحث
        searchForm.addEventListener("submit", event => {

            event.preventDefault();

            const query = searchInput.value.trim().toLowerCase();

            searchResults.replaceChildren();
            searchResults.hidden = false;

            if (!query) {
                searchResults.textContent = "اكتب اسم الخدمة للبحث.";
                return;
            }

            const matches = services.filter(service => {

                return service.name.toLowerCase().includes(query) ||
                    service.keywords.some(keyword =>
                        keyword.toLowerCase().includes(query)
                    );
            });

            if (matches.length === 0) {
                searchResults.textContent =
                    "لم يتم العثور على الخدمة. حاول بكلمة أخرى.";
                return;
            }

            // عرض نتائج البحث كرابط مباشر
            matches.forEach(service => {

                const link = document.createElement("a");

                link.href = "#" + service.id;
                link.className = "search-result-item";
                link.textContent = "✓ " + service.name;

                searchResults.appendChild(link);
            });
        });

        // إخفاء النتائج عند الكتابة من جديد
        searchInput.addEventListener("input", () => {
            searchResults.hidden = true;
            searchResults.replaceChildren();
        });

        // التعامل مع الضغط على نتيجة بحث ديناميكية
        searchResults.addEventListener("click", event => {

            const link = event.target.closest("a.search-result-item");

            if (!link) return;

            const target = document.getElementById(
                link.getAttribute("href").slice(1)
            );

            if (!target) return;

            event.preventDefault();

            searchResults.hidden = true;

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });

    } else {
        console.warn("SENTRIXA Search: HTML elements not found.");
    }

    // 9. Application Initialization
    console.log(
        "%c SENTRIXA ",
        "background:#00e5ff;color:#050b16;font-size:20px;font-weight:bold;padding:10px;"
    );

    console.log("Frontend Initialized Successfully");
    console.log("Navigation: Ready");
    console.log("Search: Ready");
    console.log("Smooth Scrolling: Ready");

});
