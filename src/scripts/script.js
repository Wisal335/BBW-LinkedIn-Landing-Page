/* =====================================================
   BIG BRAIN WAY — LINKEDIN LANDING PAGE
   Main JavaScript
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       ELEMENT REFERENCES
    ================================================= */

    const progressBar = document.querySelector(".scroll-progress");
    const mobileCTA = document.querySelector(".mobile-cta");

    const animatedElements = document.querySelectorAll(
        ".animate-on-scroll"
    );

    const hero = document.querySelector(".hero");
    const heroVisual = document.querySelector(".hero-visual");

    const solutionCards = document.querySelectorAll(
        ".solution-card"
    );

    const resultCards = document.querySelectorAll(
        ".result-card"
    );

    const dataCards = document.querySelectorAll(
        ".data-card"
    );

    /* =================================================
       SCROLL PROGRESS
    ================================================= */

    function updateScrollProgress() {

        if (!progressBar) return;

        const scrollTop =
            window.scrollY ||
            document.documentElement.scrollTop;

        const documentHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        if (documentHeight <= 0) {
            progressBar.style.width = "0%";
            return;
        }

        const progress =
            (scrollTop / documentHeight) * 100;

        progressBar.style.width =
            `${Math.min(progress, 100)}%`;
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();


    /* =================================================
       INTERSECTION OBSERVER
       Animate elements when they enter viewport
    ================================================= */

    if ("IntersectionObserver" in window) {

        const observerOptions = {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        };

        const scrollObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                observerOptions
            );

        animatedElements.forEach(element => {

            scrollObserver.observe(element);

        });

    } else {

        /* Fallback for older browsers */

        animatedElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =================================================
       SMOOTH ANCHOR NAVIGATION
    ================================================= */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    anchorLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetID =
                link.getAttribute("href");

            if (
                !targetID ||
                targetID === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetID);

            if (!target) {
                return;
            }

            event.preventDefault();

            const navbar =
                document.querySelector(".navbar");

            const navbarHeight =
                navbar
                    ? navbar.offsetHeight
                    : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: Math.max(
                    targetPosition,
                    0
                ),
                behavior: "smooth"
            });

        });

    });


    /* =================================================
       MOBILE CTA VISIBILITY
    ================================================= */

    function updateMobileCTA() {

        if (!mobileCTA) return;

        const consultation =
            document.querySelector(
                "#consultation"
            );

        if (!consultation) return;

        const consultationRect =
            consultation.getBoundingClientRect();

        const viewportHeight =
            window.innerHeight;

        const consultationVisible =
            consultationRect.top <
                viewportHeight &&
            consultationRect.bottom > 0;

        /*
         * Keep CTA visible while user is browsing.
         * Hide it when the consultation section is
         * already visible because the primary booking
         * action is directly on screen.
         */

        if (consultationVisible) {

            mobileCTA.classList.add(
                "mobile-cta-hidden"
            );

        } else {

            mobileCTA.classList.remove(
                "mobile-cta-hidden"
            );

        }

    }

    window.addEventListener(
        "scroll",
        updateMobileCTA,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        updateMobileCTA
    );

    updateMobileCTA();


    /* =================================================
       HERO MOUSE PARALLAX
    ================================================= */

    if (
        hero &&
        heroVisual &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        const orbs =
            hero.querySelectorAll(".orb");

        let targetX = 0;
        let targetY = 0;

        let currentX = 0;
        let currentY = 0;

        hero.addEventListener(
            "mousemove",
            event => {

                const rect =
                    hero.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                targetX =
                    (x - 0.5) * 2;

                targetY =
                    (y - 0.5) * 2;

            }
        );

        hero.addEventListener(
            "mouseleave",
            () => {

                targetX = 0;
                targetY = 0;

            }
        );

        function animateHeroParallax() {

            currentX +=
                (targetX - currentX) * 0.04;

            currentY +=
                (targetY - currentY) * 0.04;

            if (orbs.length) {

                orbs.forEach(
                    (orb, index) => {

                        const strength =
                            8 + index * 5;

                        const x =
                            currentX * strength;

                        const y =
                            currentY * strength;

                        /*
                         * CSS animations can conflict with
                         * transform. Therefore use CSS
                         * variables instead of replacing
                         * transform directly.
                         */

                        orb.style.setProperty(
                            "--mouse-x",
                            `${x}px`
                        );

                        orb.style.setProperty(
                            "--mouse-y",
                            `${y}px`
                        );

                    }
                );

            }

            requestAnimationFrame(
                animateHeroParallax
            );

        }

        animateHeroParallax();

    }


    /* =================================================
       SOLUTION CARD 3D TILT
    ================================================= */

    if (
        solutionCards.length &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        solutionCards.forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    const centerX =
                        rect.width / 2;

                    const centerY =
                        rect.height / 2;

                    const rotateY =
                        ((x - centerX) /
                            centerX) * 4;

                    const rotateX =
                        ((centerY - y) /
                            centerY) * 4;

                    card.style.transform =
                        `perspective(800px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-8px)`;

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}px`
                    );

                    card.style.setProperty(
                        "--mouse-y",
                        `${y}px`
                    );

                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform = "";

                    card.style.removeProperty(
                        "--mouse-x"
                    );

                    card.style.removeProperty(
                        "--mouse-y"
                    );

                }
            );

        });

    }


    /* =================================================
       RESULT CARD HOVER EFFECT
    ================================================= */

    if (
        resultCards.length &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        resultCards.forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}px`
                    );

                    card.style.setProperty(
                        "--mouse-y",
                        `${y}px`
                    );

                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.removeProperty(
                        "--mouse-x"
                    );

                    card.style.removeProperty(
                        "--mouse-y"
                    );

                }
            );

        });

    }


    /* =================================================
       DATA CARD MOUSE INTERACTION
    ================================================= */

    if (
        dataCards.length &&
        window.matchMedia(
            "(pointer: fine)"
        ).matches
    ) {

        dataCards.forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}px`
                    );

                    card.style.setProperty(
                        "--mouse-y",
                        `${y}px`
                    );

                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.removeProperty(
                        "--mouse-x"
                    );

                    card.style.removeProperty(
                        "--mouse-y"
                    );

                }
            );

        });

    }


    /* =================================================
       METRIC COUNTER ANIMATION
       Used when result cards become visible
    ================================================= */

    const metricNumbers =
        document.querySelectorAll(
            ".metric-number"
        );

    function animateMetric(
        element
    ) {

        if (
            element.dataset.animated ===
            "true"
        ) {
            return;
        }

        element.dataset.animated =
            "true";

        const original =
            element.textContent.trim();

        /*
         * Extract numeric value while keeping
         * suffix such as %, x or K.
         */

        const match =
            original.match(
                /^([^0-9]*)([\d.]+)(.*)$/
            );

        if (!match) return;

        const prefix = match[1];
        const numericValue =
            parseFloat(match[2]);

        const suffix = match[3];

        if (Number.isNaN(numericValue)) {
            return;
        }

        const duration = 1000;
        const startTime =
            performance.now();

        function updateCounter(
            currentTime
        ) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );

            /*
             * Ease-out animation
             */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            const current =
                numericValue * eased;

            let displayValue;

            if (
                Number.isInteger(
                    numericValue
                )
            ) {

                displayValue =
                    Math.round(
                        current
                    );

            } else {

                displayValue =
                    current.toFixed(1);

            }

            element.textContent =
                `${prefix}${displayValue}${suffix}`;

            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                element.textContent =
                    original;

            }

        }

        requestAnimationFrame(
            updateCounter
        );

    }


    if (
        metricNumbers.length &&
        "IntersectionObserver" in window
    ) {

        const metricObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            animateMetric(
                                entry.target
                            );

                            metricObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.5
                }
            );

        metricNumbers.forEach(
            metric => {

                metricObserver.observe(
                    metric
                );

            }
        );

    }


    /* =================================================
       HERO METRIC BAR OBSERVATION
    ================================================= */

    const metricFills =
        document.querySelectorAll(
            ".metric-fill"
        );

    metricFills.forEach(fill => {

        const width =
            fill.style.width;

        if (width) {

            fill.dataset.width =
                width;

        }

    });


    /* =================================================
       NUMBER / STAT REVEAL
    ================================================= */

    const statItems =
        document.querySelectorAll(
            ".stat-item"
        );

    if (
        statItems.length &&
        "IntersectionObserver" in window
    ) {

        const statObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.classList.add(
                                "stat-visible"
                            );

                            statObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.4
                }
            );

        statItems.forEach(
            item => {

                statObserver.observe(
                    item
                );

            }
        );

    }


    /* =================================================
       CALENDLY LOAD DETECTION
    ================================================= */

    const calendlyIframe =
        document.querySelector(
            ".calendly-wrapper iframe"
        );

    if (calendlyIframe) {

        calendlyIframe.addEventListener(
            "load",
            () => {

                calendlyIframe.classList.add(
                    "calendly-loaded"
                );

            }
        );

    }


    /* =================================================
       EXTERNAL CALENDLY LINK
       Open booking in new tab
    ================================================= */

    const calendlyLinks =
        document.querySelectorAll(
            'a[href*="calendly.com"]'
        );

    calendlyLinks.forEach(link => {

        link.setAttribute(
            "target",
            "_blank"
        );

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });


    /* =================================================
       REDUCE MOTION ACCESSIBILITY
    ================================================= */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    function handleReducedMotion() {

        if (!reducedMotion.matches) {
            return;
        }

        document.documentElement.classList.add(
            "reduce-motion"
        );

        animatedElements.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

    }

    reducedMotion.addEventListener?.(
        "change",
        handleReducedMotion
    );

    handleReducedMotion();


    /* =================================================
       VIEWPORT HEIGHT VARIABLE
       Helps mobile layouts
    ================================================= */

    function updateViewportHeight() {

        const vh =
            window.innerHeight * 0.01;

        document.documentElement.style.setProperty(
            "--vh",
            `${vh}px`
        );

    }

    updateViewportHeight();

    window.addEventListener(
        "resize",
        updateViewportHeight
    );


    /* =================================================
       PAGE VISIBILITY
       Pause expensive effects when tab is hidden
    ================================================= */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                document.documentElement.classList.add(
                    "page-hidden"
                );

            } else {

                document.documentElement.classList.remove(
                    "page-hidden"
                );

                updateScrollProgress();
                updateMobileCTA();

            }

        }
    );


    /* =================================================
       KEYBOARD ACCESSIBILITY
       Make clickable CTA elements obvious
    ================================================= */

    const interactiveElements =
        document.querySelectorAll(
            "a, button"
        );

    interactiveElements.forEach(
        element => {

            element.addEventListener(
                "focus",
                () => {

                    element.classList.add(
                        "keyboard-focus"
                    );

                }
            );

            element.addEventListener(
                "blur",
                () => {

                    element.classList.remove(
                        "keyboard-focus"
                    );

                }
            );

        }
    );


    /* =================================================
       CONSOLE STATUS
       Development helper
    ================================================= */

    console.log(
        "Big Brain Way LinkedIn Landing Page initialized."
    );

});