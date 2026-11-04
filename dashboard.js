
"use strict";

// ==========================================
// SENTRIXA - Advanced Security Dashboard
// Chart.js + Leaflet + Responsive Controller
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // 1. CURRENT YEAR
    // ======================================

    const footer = document.querySelector("footer");

    if (footer) {
        footer.textContent =
            `© ${new Date().getFullYear()} SENTRIXA Cybersecurity. All Rights Reserved.`;
    }

    console.log("SENTRIXA Dashboard Started Successfully");


    // ======================================
    // 2. ANIMATED STATISTICS
    // ======================================

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


    // ======================================
    // 3. DASHBOARD CLOCK
    // ======================================

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


    // ======================================
    // 4. SIDEBAR NAVIGATION
    // ======================================

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


    // ======================================
    // 5. THREAT INTERACTIONS
    // ======================================

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


    // ======================================
    // 6. CHART.JS CHECK
    // ======================================

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js could not be loaded. Check your internet connection."
        );

    } else {

        // CHART DEFAULT SETTINGS

        Chart.defaults.color = "#91a8bd";

        Chart.defaults.font.family =
            '"Segoe UI", Tahoma, Arial, sans-serif';

        Chart.defaults.font.size = 11;


        // ==================================
        // 7. WEEKLY ATTACKS CHART
        // ==================================

        const attacksCanvas =
            document.getElementById("attacksChart");

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


        // ==================================
        // 8. THREAT LEVELS DOUGHNUT CHART
        // ==================================

        const threatCanvas =
            document.getElementById("threatChart");

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

    }


    // ======================================
    // 9. LEAFLET MAP
    // ======================================

    const mapContainer =
        document.getElementById("threatMap");

    if (mapContainer) {

        if (typeof L === "undefined") {

            console.error(
                "Leaflet could not be loaded. Check your internet connection."
            );

            mapContainer.innerHTML = `
                <div style="
                    color:#ffb547;
                    padding:25px;
                    text-align:center;
                ">
                    تعذر تحميل الخريطة. تحقق من اتصال الإنترنت.
                </div>
            `;

        } else {

            // INITIALIZE MAP

            const map = L.map("threatMap", {
                center: [25, 15],
                zoom: 2,
                minZoom: 2,
                maxZoom: 12,
                worldCopyJump: true
            });


            // OPENSTREETMAP REAL MAP TILES

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    maxZoom: 19
                }
            ).addTo(map);


            // MAP EVENT DATA
            // DEMO DATA ONLY - NOT REAL ATTACKS

            const demoEvents = [

                {
                    country: "مصر",
                    city: "القاهرة",
                    coords: [30.0444, 31.2357],
                    level: "مرتفع",
                    color: "#ff4d6d",
                    description: "حدث أمني تجريبي"
                },

                {
                    country: "ألمانيا",
                    city: "برلين",
                    coords: [52.5200, 13.4050],
                    level: "متوسط",
                    color: "#ffb547",
                    description: "حدث أمني تجريبي"
                },

                {
                    country: "الولايات المتحدة",
                    city: "نيويورك",
                    coords: [40.7128, -74.0060],
                    level: "مرتفع",
                    color: "#ff4d6d",
                    description: "حدث أمني تجريبي"
                },

                {
                    country: "اليابان",
                    city: "طوكيو",
                    coords: [35.6762, 139.6503],
                    level: "منخفض",
                    color: "#00e6a0",
                    description: "حدث أمني تجريبي"
                },

                {
                    country: "البرازيل",
                    city: "ساو باولو",
                    coords: [-23.5505, -46.6333],
                    level: "متوسط",
                    color: "#ffb547",
                    description: "حدث أمني تجريبي"
                },

                {
                    country: "المملكة المتحدة",
                    city: "لندن",
                    coords: [51.5072, -0.1276],
                    level: "منخفض",
                    color: "#00e6a0",
                    description: "حدث أمني تجريبي"
                }

            ];


            // ADD MAP MARKERS

            demoEvents.forEach((event) => {

                const marker = L.circleMarker(
                    event.coords,
                    {
                        radius: 9,
                        color: event.color,
                        fillColor: event.color,
                        fillOpacity: 0.8,
                        weight: 2
                    }
                ).addTo(map);

                marker.bindPopup(`
                    <div dir="rtl">
                        <strong>${event.country} - ${event.city}</strong>
                        <br>
                        مستوى الحدث: ${event.level}
                        <br>
                        ${event.description}
                    </div>
                `);

            });


            // MAP READY

            setTimeout(() => {
                map.invalidateSize();
            }, 300);

            console.log(
                "SENTRIXA Global Map Loaded Successfully - Demo Events"
            );

        }

    }


    // ======================================
    // 10. DASHBOARD READY
    // ======================================

    console.log("SENTRIXA Analytics Loaded Successfully");

});
