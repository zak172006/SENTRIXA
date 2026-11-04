

"use strict";

// ==========================================
// SENTRIXA - Advanced Dashboard Controller
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // 1. CURRENT YEAR
    const footer = document.querySelector("footer");

    if (footer) {
        footer.textContent =
            `© ${new Date().getFullYear()} SENTRIXA Cybersecurity. All Rights Reserved.`;
    }

    console.log("SENTRIXA Dashboard Started Successfully");

    // 2. ANIMATED STATISTICS
    const statNumbers = document.querySelectorAll("[data-count]");

    statNumbers.forEach((element) => {

        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || "";

        if (!Number.isFinite(target)) return;

        const duration = 1200;
        const startTime = performance.now();

        function animateNumber(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(
                target * easedProgress
            );

            element.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(animateNumber);
            }

        }

        requestAnimationFrame(animateNumber);

    });

    // 3. DASHBOARD CLOCK
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

        clock.textContent =
            "الوقت الحالي: " +
            new Date().toLocaleTimeString("ar-EG");

    }

    updateClock();
    setInterval(updateClock, 1000);

    // 4. SIDEBAR NAVIGATION
    const navigationLinks = document.querySelectorAll(
        ".sidebar nav a[href^='#']"
    );

    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {

            navigationLinks.forEach((item) => {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });

    // 5. THREAT INTERACTIONS
    const threatRows = document.querySelectorAll(".threat-row");

    threatRows.forEach((row) => {

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

    // 6. CHART.JS CHECK
    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js could not be loaded. Check your internet connection."
        );

        return;

    }

    // 7. CHART DEFAULT SETTINGS
    Chart.defaults.color = "#91a8bd";

    Chart.defaults.font.family =
        '"Segoe UI", Tahoma, Arial, sans-serif';

    Chart.defaults.font.size = 11;

    // 8. WEEKLY ATTACKS CHART
    const attacksCanvas = document.getElementById("attacksChart");

    if (attacksCanvas) {

        new Chart(attacksCanvas, {

            type: "line",

            data: {

                labels: [
                    "السبت",
                    "الأحد",
                    "الإثنين",
                    "الثلاثاء",
                    "الأربعاء",
                    "الخميس",
                    "الجمعة"
                ],

                datasets: [{

                    label: "الهجمات المكتشفة",

                    data: [12, 19, 8, 25, 16, 30, 21],

                    borderColor: "#00d9ff",

                    backgroundColor: "rgba(0,217,255,0.12)",

                    borderWidth: 3,

                    pointBackgroundColor: "#00d9ff",

                    pointBorderColor: "#ffffff",

                    pointRadius: 4,

                    pointHoverRadius: 7,

                    fill: true,

                    tension: 0.4

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {

                    legend: {
                        display: false
                    },

                    tooltip: {
                        backgroundColor: "#081525",
                        titleColor: "#00d9ff",
                        bodyColor: "#ffffff",
                        borderColor: "rgba(0,217,255,0.3)",
                        borderWidth: 1,
                        padding: 12
                    }

                },

                scales: {

                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    },

                    y: {
                        beginAtZero: true,

                        grid: {
                            color: "rgba(145,168,189,0.10)"
                        },

                        border: {
                            display: false
                        },

                        ticks: {
                            precision: 0
                        }

                    }

                }

            }

        });

    }

    // 9. THREAT LEVELS DOUGHNUT CHART
    const threatCanvas = document.getElementById("threatChart");

    if (threatCanvas) {

        new Chart(threatCanvas, {

            type: "doughnut",

            data: {

                labels: [
                    "مرتفع",
                    "متوسط",
                    "منخفض"
                ],

                datasets: [{

                    data: [25, 35, 40],

                    backgroundColor: [
                        "#ff4d6d",
                        "#ffb547",
                        "#00e6a0"
                    ],

                    borderColor: "#0d1d30",

                    borderWidth: 4,

                    hoverOffset: 10

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "70%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {
                            usePointStyle: true,
                            pointStyle: "circle",
                            padding: 20
                        }

                    },

                    tooltip: {
                        backgroundColor: "#081525",
                        padding: 12
                    }

                }

            }

        });

    }

    // 10. DASHBOARD READY
    console.log("SENTRIXA Analytics Loaded Successfully");

});
