
"use strict";

// ==========================================
// SENTRIXA - Dashboard Controller
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. Current Year
    const footer = document.querySelector("footer");

    if (footer) {
        footer.textContent =
            `© ${new Date().getFullYear()} SENTRIXA Cybersecurity. All Rights Reserved.`;
    }

    // 2. Welcome Message
    console.log("SENTRIXA Dashboard Started Successfully");

    // 3. Animate Statistics
    const statNumbers = document.querySelectorAll(
        ".stat-card h2"
    );

    statNumbers.forEach((element) => {

        const originalText = element.textContent.trim();

        if (!/^\d+%?$/.test(originalText)) {
            return;
        }

        const target = parseInt(originalText, 10);
        const hasPercent = originalText.includes("%");

        let current = 0;
        const duration = 1200;
        const steps = 40;
        const increment = target / steps;

        const timer = setInterval(() => {

            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            element.textContent =
                Math.floor(current) + (hasPercent ? "%" : "");

        }, duration / steps);

    });

    // 4. Threat Notification Interaction
    const threatRows = document.querySelectorAll(".threat-row");

    threatRows.forEach((row) => {

        row.style.cursor = "pointer";

        row.addEventListener("click", () => {

            const title = row.querySelector("strong");

            if (title) {
                alert(
                    "SENTRIXA Security Alert\n\n" +
                    title.textContent +
                    "\n\nهذه بيانات تجريبية وليست تنبيهاً أمنياً حقيقياً."
                );
            }

        });

    });

    // 5. Sidebar Navigation
    const navigationLinks = document.querySelectorAll(
        ".sidebar nav a"
    );

    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navigationLinks.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });

    // 6. Dashboard Clock
    const clock = document.createElement("div");

    clock.className = "dashboard-clock";

    clock.style.cssText = `
        color: #00d9ff;
        font-size: 12px;
        margin-top: 8px;
    `;

    const topbar = document.querySelector(".topbar > div");

    if (topbar) {
        topbar.appendChild(clock);
    }

    function updateClock() {

        const now = new Date();

        clock.textContent =
            "الوقت الحالي: " +
            now.toLocaleTimeString("ar-EG");

    }

    updateClock();

    setInterval(updateClock, 1000);

    // 7. Dashboard Ready
    console.log("All Dashboard Features Loaded");

});
