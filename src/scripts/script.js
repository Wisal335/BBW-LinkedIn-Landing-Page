/* =====================================================
   BIG BRAIN WAY — LINKEDIN LANDING PAGE
   FORM + PAGE INTERACTIONS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const GOOGLE_APPS_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbzU8ygBNUhzK_fdNID6WAMsi5C9piKrWDWRcM7d4u_GtfV3phqR9wf20TRmnRiaPRVEVA/exec";


    /* =====================================================
       SCROLL PROGRESS
    ===================================================== */

    const scrollProgress =
        document.querySelector(".scroll-progress");

    function updateScrollProgress() {

        if (!scrollProgress) return;

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        if (documentHeight <= 0) {
            scrollProgress.style.width = "0%";
            return;
        }

        const progress =
            (scrollTop / documentHeight) * 100;

        scrollProgress.style.width =
            `${Math.min(progress, 100)}%`;
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                menuToggle.classList.toggle("active");

            navLinks.classList.toggle(
                "active",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );
        });


        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                menuToggle.classList.remove("active");

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });

        });
    }


    /* =====================================================
       SMOOTH ANCHOR SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(".animate-on-scroll");

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("visible");

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        animatedElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        animatedElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       CONSULTATION FORM
    ===================================================== */

    const consultationForm =
        document.getElementById(
            "consultationForm"
        );

    if (consultationForm) {

        const submitButton =
            consultationForm.querySelector(
                ".form-submit"
            );

        const submitText =
            submitButton
                ? submitButton.querySelector("span")
                : null;


        consultationForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* -----------------------------------------
                   BASIC VALIDATION
                ----------------------------------------- */

                if (!consultationForm.checkValidity()) {

                    consultationForm.reportValidity();

                    return;
                }


                /* -----------------------------------------
                   HONEYPOT CHECK
                ----------------------------------------- */

                const honeypot =
                    consultationForm.querySelector(
                        '[name="bot-field"]'
                    );

                if (
                    honeypot &&
                    honeypot.value.trim() !== ""
                ) {

                    return;
                }


                /* -----------------------------------------
                   GET FORM DATA
                ----------------------------------------- */

                const formData =
                    new FormData(
                        consultationForm
                    );


                /* -----------------------------------------
                   CONVERT TO OBJECT
                ----------------------------------------- */

                const data = {

                    firstName:
                        formData.get("firstName") || "",

                    lastName:
                        formData.get("lastName") || "",

                    businessName:
                        formData.get("businessName") || "",

                    email:
                        formData.get("email") || "",

                    phone:
                        formData.get("phone") || "",

                    website:
                        formData.get("website") || "",

                    challenge:
                        formData.get("challenge") || "",

                    preferredDate:
                        formData.get("preferredDate") || "",

                    preferredTime:
                        formData.get("preferredTime") || "",

                    consent:
                        formData.get("consent") || "",

                    source:
                        formData.get("source") || "LinkedIn"

                };


                /* -----------------------------------------
                   BUTTON LOADING STATE
                ----------------------------------------- */

                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.classList.add(
                        "is-loading"
                    );
                }

                if (submitText) {

                    submitText.textContent =
                        "Sending Request...";
                }


                try {

                    /* -------------------------------------
                       SEND TO GOOGLE APPS SCRIPT
                    ------------------------------------- */

                    const response =
                        await fetch(
                            GOOGLE_APPS_SCRIPT_URL,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "text/plain;charset=utf-8"
                                },

                                body:
                                    JSON.stringify(data)
                            }
                        );


                    /* -------------------------------------
                       READ RESPONSE
                    ------------------------------------- */

                    const result =
                        await response.json();


                    if (!result.success) {

                        throw new Error(
                            result.error ||
                            "Unable to submit the form."
                        );
                    }


                    /* -------------------------------------
                       SUCCESS
                    ------------------------------------- */

                    showFormMessage(
                        consultationForm,
                        "success",
                        "Thank you! Your consultation request has been received. We will contact you to confirm the conversation."
                    );


                    consultationForm.reset();


                } catch (error) {

                    console.error(
                        "Consultation form error:",
                        error
                    );


                    /* -------------------------------------
                       ERROR
                    ------------------------------------- */

                    showFormMessage(
                        consultationForm,
                        "error",
                        "Something went wrong while sending your request. Please try again."
                    );


                } finally {

                    /* -------------------------------------
                       RESTORE BUTTON
                    ------------------------------------- */

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.classList.remove(
                            "is-loading"
                        );
                    }

                    if (submitText) {

                        submitText.textContent =
                            "Request My Free Consultation";
                    }

                }

            }
        );

    }


    /* =====================================================
       FORM MESSAGE
    ===================================================== */

    function showFormMessage(
        form,
        type,
        message
    ) {

        let messageElement =
            form.querySelector(
                ".form-message"
            );


        if (!messageElement) {

            messageElement =
                document.createElement("div");

            messageElement.className =
                "form-message";

            form.appendChild(
                messageElement
            );
        }


        messageElement.className =
            `form-message ${type}`;

        messageElement.textContent =
            message;


        messageElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });


        /* -----------------------------------------
           REMOVE AFTER A WHILE
        ----------------------------------------- */

        setTimeout(() => {

            if (messageElement) {

                messageElement.classList.add(
                    "fade-out"
                );

            }

        }, 8000);

    }


    /* =====================================================
       DATE VALIDATION
       Prevent selecting a date in the past
    ===================================================== */

    const preferredDate =
        document.getElementById(
            "preferredDate"
        );

    if (preferredDate) {

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        preferredDate.min =
            `${year}-${month}-${day}`;
    }


    /* =====================================================
       HERO MOUSE GLOW
    ===================================================== */

    const hero =
        document.querySelector(".hero");

    if (hero) {

        hero.addEventListener(
            "mousemove",
            event => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    hero.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                hero.style.setProperty(
                    "--mouse-x",
                    `${x}px`
                );

                hero.style.setProperty(
                    "--mouse-y",
                    `${y}px`
                );

            }
        );

    }


    /* =====================================================
       3D CARD TILT
    ===================================================== */

    const tiltCards =
        document.querySelectorAll(
            "[data-tilt]"
        );

    tiltCards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                if (
                    window.matchMedia(
                        "(max-width: 700px)"
                    ).matches
                ) {
                    return;
                }

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

                const rotateX =
                    ((y - centerY) /
                        centerY) *
                    -3;

                const rotateY =
                    ((x - centerX) /
                        centerX) *
                    3;

                card.style.transform =
                    `perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-4px)`;

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform = "";

            }
        );

    });


    /* =====================================================
       MAGNETIC BUTTONS
    ===================================================== */

    const magneticButtons =
        document.querySelectorAll(
            ".magnetic"
        );

    magneticButtons.forEach(button => {

        button.addEventListener(
            "mousemove",
            event => {

                if (
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                ) {
                    return;
                }

                if (
                    window.matchMedia(
                        "(max-width: 700px)"
                    ).matches
                ) {
                    return;
                }

                const rect =
                    button.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;

                button.style.transform =
                    `translate(${x * 0.08}px,
                               ${y * 0.08}px)`;

            }
        );


        button.addEventListener(
            "mouseleave",
            () => {

                button.style.transform = "";

            }
        );

    });


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    const backToTop =
        document.querySelector(
            ".back-to-top"
        );

    if (backToTop) {

        window.addEventListener(
            "scroll",
            () => {

                if (window.scrollY > 600) {

                    backToTop.classList.add(
                        "visible"
                    );

                } else {

                    backToTop.classList.remove(
                        "visible"
                    );

                }

            },
            { passive: true }
        );


        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* =====================================================
       MOBILE STICKY CTA
    ===================================================== */

    const mobileCTA =
        document.querySelector(
            ".mobile-sticky-cta"
        );

    if (mobileCTA) {

        window.addEventListener(
            "scroll",
            () => {

                if (
                    window.scrollY > 500
                ) {

                    mobileCTA.classList.add(
                        "visible"
                    );

                } else {

                    mobileCTA.classList.remove(
                        "visible"
                    );

                }

            },
            { passive: true }
        );

    }

});