
"use strict";

// ==========================================
// SENTRIXA - Advanced Smart Search System
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

    // ======================================
    // 3. Smooth Scrolling
    // ======================================

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
            header.classList.toggle("scrolled", window.scrollY > 50);
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
        link.setAttribute("rel", "noopener noreferrer");
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
    // 8. SMART SEARCH ELEMENTS
    // ======================================

    const searchForm = document.getElementById("siteSearch");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    // ======================================
    // 9. SERVICES DATABASE
    // ======================================

    const services = [
        {
            name: "حماية المواقع",
            id: "service-website",
            icon: "🛡️",
            description: "تحليل المواقع واكتشاف نقاط الضعف وتحسين الحماية.",
            keywords: [
                "حماية المواقع",
                "المواقع",
                "موقع",
                "website",
                "web security",
                "website security",
                "حماية الويب"
            ]
        },
        {
            name: "الفحص الأمني",
            id: "service-scan",
            icon: "🔍",
            description: "فحص الأنظمة واكتشاف المخاطر والثغرات المحتملة.",
            keywords: [
                "الفحص الأمني",
                "فحص",
                "اختبار الاختراق",
                "الثغرات",
                "اختراق",
                "security scan",
                "penetration testing",
                "vulnerability"
            ]
        },
        {
            name: "حماية البيانات",
            id: "service-data",
            icon: "🔐",
            description: "حماية المعلومات وتقليل مخاطر تسريب البيانات.",
            keywords: [
                "حماية البيانات",
                "البيانات",
                "المعلومات",
                "خصوصية",
                "data",
                "data protection",
                "privacy"
            ]
        },
        {
            name: "مراقبة التهديدات",
            id: "service-monitoring",
            icon: "📡",
            description: "متابعة التهديدات والأنشطة الرقمية المشبوهة.",
            keywords: [
                "مراقبة التهديدات",
                "التهديدات",
                "الهجمات",
                "مراقبة",
                "cyber threats",
                "monitoring",
                "threat detection"
            ]
        },
        {
            name: "التقارير الأمنية",
            id: "service-reports",
            icon: "📊",
            description: "تقارير توضح نتائج الفحص والمخاطر والتوصيات.",
            keywords: [
                "التقارير الأمنية",
                "التقارير",
                "تقرير",
                "نتائج",
                "reports",
                "security reports"
            ]
        },
        {
            name: "التوعية الأمنية",
            id: "service-awareness",
            icon: "🎓",
            description: "تعلم أساسيات الأمن السيبراني وتجنب المخاطر الرقمية.",
            keywords: [
                "التوعية الأمنية",
                "التوعية",
                "التعليم",
                "أمن المعلومات",
                "awareness",
                "cyber awareness",
                "security education"
            ]
        }
    ];

    // ======================================
    // 10. SEARCH ENGINE
    // ======================================

    if (searchForm && searchInput && searchResults) {

        searchResults.setAttribute("aria-live", "polite");

        // توحيد الكتابة العربية والإنجليزية
        const normalizeText = text => {

            return text
                .toLowerCase()
                .trim()
                .normalize("NFKC")
                .replace(/[\u064B-\u065F\u0670]/g, "")
                .replace(/\u0640/g, "")
                .replace(/[أإآٱ]/g, "ا")
                .replace(/ى/g, "ي")
                .replace(/\s+/g, " ");
        };

        // البحث داخل قاعدة الخدمات
        const findServices = query => {

            const normalizedQuery = normalizeText(query);

            if (!normalizedQuery) return [];

            const queryWords = normalizedQuery.split(" ");

            return services
                .map(service => {

                    const searchableText = normalizeText(
                        [
                            service.name,
                            ...service.keywords,
                            service.description
                        ].join(" ")
                    );

                    let score = 0;

                    if (normalizeText(service.name) === normalizedQuery) {
                        score += 100;
                    }

                    if (searchableText.includes(normalizedQuery)) {
                        score += 50;
                    }

                    queryWords.forEach(word => {
                        if (word.length > 0 && searchableText.includes(word)) {
                            score += 10;
                        }
                    });

                    return {
                        ...service,
                        score
                    };
                })
                .filter(service => service.score > 0)
                .sort((a, b) => b.score - a.score);
        };

        // إخفاء النتائج
        const hideResults = () => {
            searchResults.hidden = true;
            searchResults.replaceChildren();
            searchInput.setAttribute("aria-expanded", "false");
        };

        // عرض النتائج والاقتراحات
        const showResults = (query, isSearch = false) => {

            searchResults.replaceChildren();

            const matches = findServices(query);

            searchResults.hidden = false;
            searchInput.setAttribute("aria-expanded", "true");

            if (!matches.length) {

                const message = document.createElement("div");
                message.className = "search-empty";

                message.textContent = "لم نجد الخدمة المطلوبة. جرّب كلمة بحث أخرى.";

                searchResults.appendChild(message);
                return;
            }

            // عنوان النتائج
            const heading = document.createElement("div");

            heading.className = "search-results-title";

            heading.textContent = isSearch
                ? `نتائج البحث (${matches.length})`
                : "اقتراحات الخدمات";

            searchResults.appendChild(heading);

            // عرض الخدمات
            matches.forEach(service => {

                const link = document.createElement("a");

                link.href = "#" + service.id;
                link.className = "search-result-item";

                const icon = document.createElement("span");
                icon.className = "search-result-icon";
                icon.textContent = service.icon;

                const content = document.createElement("span");
                content.className = "search-result-content";

                const title = document.createElement("strong");
                title.textContent = service.name;

                const description = document.createElement("small");
                description.textContent = service.description;

                const arrow = document.createElement("span");
                arrow.className = "search-result-arrow";
                arrow.textContent = "←";

                content.append(title, description);
                link.append(icon, content, arrow);

                searchResults.appendChild(link);
            });
        };

        // ==================================
        // 11. LIVE SEARCH
        // ==================================

        searchInput.addEventListener("input", () => {

            const query = searchInput.value.trim();

            if (!query) {
                hideResults();
                return;
            }

            showResults(query);
        });

        // ==================================
        // 12. FORM SUBMISSION
        // ==================================

        searchForm.addEventListener("submit", event => {

            event.preventDefault();

            const query = searchInput.value.trim();

            if (!query) {

                searchResults.hidden = false;
                searchResults.replaceChildren();

                const message = document.createElement("div");
                message.className = "search-empty";
                message.textContent = "اكتب اسم الخدمة التي تبحث عنها.";

                searchResults.appendChild(message);

                searchInput.focus();
                return;
            }

            showResults(query, true);
        });

        // ==================================
        // 13. KEYBOARD NAVIGATION
        // ==================================

        searchInput.addEventListener("keydown", event => {

            const items = [
                ...searchResults.querySelectorAll(".search-result-item")
            ];

            if (event.key === "ArrowDown" && !searchResults.hidden) {

                if (items.length) {
                    event.preventDefault();
                    items[0].focus();
                }
            }

            if (event.key === "Escape") {
                hideResults();
            }
        });

        searchResults.addEventListener("keydown", event => {

            const items = [
                ...searchResults.querySelectorAll(".search-result-item")
            ];

            const currentIndex = items.indexOf(document.activeElement);

            if (event.key === "ArrowDown") {
                event.preventDefault();

                if (currentIndex < items.length - 1) {
                    items[currentIndex + 1].focus();
                }
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();

                if (currentIndex > 0) {
                    items[currentIndex - 1].focus();
                } else {
                    searchInput.focus();
                }
            }

            if (event.key === "Escape") {
                hideResults();
                searchInput.focus();
            }
        });

        // ==================================
        // 14. SELECT SEARCH RESULT
        // ==================================

        searchResults.addEventListener("click", event => {

            const link = event.target.closest(".search-result-item");

            if (!link) return;

            const targetId = link.getAttribute("href").slice(1);
            const target = document.getElementById(targetId);

            if (!target) return;

            event.preventDefault();

            hideResults();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "center"
            });

            // إبراز الخدمة المطلوبة
            target.classList.add("search-highlight");

            window.setTimeout(() => {
                target.classList.remove("search-highlight");
            }, 1800);

            searchInput.value = "";
        });

        // ==================================
        // 15. CLOSE SEARCH ON OUTSIDE CLICK
        // ==================================

        document.addEventListener("click", event => {

            if (
                !searchForm.contains(event.target) &&
                !searchResults.contains(event.target)
            ) {
                hideResults();
            }
        });

    } else {

        console.warn("SENTRIXA Search: HTML elements not found.");
    }

    // ======================================
    // 16. APPLICATION INITIALIZATION
    // ======================================

    console.log(
        "%c SENTRIXA ",
        "background:#00e5ff;color:#050b16;font-size:20px;font-weight:bold;padding:10px;"
    );

    console.log("Frontend Initialized Successfully");
    console.log("Navigation: Ready");
    console.log("Smart Search: Ready");
    console.log("Live Suggestions: Ready");
    console.log("Keyboard Navigation: Ready");
    console.log("Smooth Scrolling: Ready");

});
