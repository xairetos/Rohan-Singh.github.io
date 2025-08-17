document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("checkbox");
    const body = document.body;
    const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const scrollDownArrow = document.querySelector(".scroll-down-arrow");

    // --- Theme Toggling --- //
    function setTheme(theme) {
        if (theme === "dark") {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            themeToggle.checked = true;
            localStorage.setItem("theme", "dark");
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            themeToggle.checked = false;
            localStorage.setItem("theme", "light");
        }
    }

    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme ? savedTheme : "light"); // Default to light

    themeToggle.addEventListener("change", () => {
        setTheme(themeToggle.checked ? "dark" : "light");
    });

    // --- Mobile Navigation --- //
    mobileNavToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    });

    // --- Smooth Scrolling --- //
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust offset for fixed header and desired centering
                const headerHeight = document.querySelector(".site-header").offsetHeight;
                let offset = 0;
                if (targetId === "#hero") { // For the hero section, scroll to top
                    offset = 0;
                } else {
                    // For other sections, calculate offset to center them or just below the header
                    offset = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20; // 20px extra gap
                }
                
                window.scrollTo({ top: offset, behavior: "smooth" });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) --- //
    const animatedSections = document.querySelectorAll(".animate-on-scroll");
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 }; // Slightly higher threshold
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                 // Optional: Remove class if you want animation to repeat when scrolling back up
                 // entry.target.classList.remove("is-visible");
            }
        });
    };
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    animatedSections.forEach(section => { scrollObserver.observe(section); });

    // --- Mouse Follower (Batman Logo) --- //
    const batmanLogo = document.createElement("img");
    batmanLogo.src = "images/Portfolio/batman_logo_new.png"; // Path to your Batman logo image
    batmanLogo.classList.add("batman-logo-follower");
    document.body.appendChild(batmanLogo);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    const speed = 0.1; // Smoothing factor (lower = smoother/slower)

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        batmanLogo.style.opacity = "1"; // Show follower once mouse moves
    });

    function animateFollower() {
        let dx = mouseX - followerX;
        let dy = mouseY - followerY;

        followerX += dx * speed;
        followerY += dy * speed;

        // Adjust position to center the image on the cursor
        batmanLogo.style.left = (followerX - batmanLogo.offsetWidth / 2) + "px";
        batmanLogo.style.top = (followerY - batmanLogo.offsetHeight / 2) + "px";

        requestAnimationFrame(animateFollower);
    }
    animateFollower(); // Start the animation loop

    // Hide on mobile
    function checkMobile() {
        if (window.innerWidth <= 768) {
            batmanLogo.style.display = "none";
        } else {
            batmanLogo.style.display = "block";
        }
    }
    window.addEventListener("resize", checkMobile);
    checkMobile(); // Initial check

    // --- Scroll Arrow Visibility --- //
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) { // Show after scrolling 100px
            scrollDownArrow.classList.add("visible");
        } else {
            scrollDownArrow.classList.remove("visible");
        }
    });

    // --- Custom Portfolio Popup --- //
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    const popup = document.getElementById("portfolioPopup");
    const popupImage = document.getElementById("popupImage");
    const popupClose = document.getElementById("popupClose");
    const popupPrev = document.getElementById("popupPrev");
    const popupNext = document.getElementById("popupNext");
    let currentImageIndex = 0;
    const images = Array.from(portfolioItems).map(item => item.dataset.src);

    function showPopup(index) {
        currentImageIndex = index;
        popupImage.src = images[currentImageIndex];
        popup.classList.add("active");
    }

    function closePopup() {
        popup.classList.remove("active");
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        popupImage.src = images[currentImageIndex];
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        popupImage.src = images[currentImageIndex];
    }

    portfolioItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            showPopup(index);
        });
    });

    popupClose.addEventListener("click", closePopup);
    popupPrev.addEventListener("click", showPrevImage);
    popupNext.addEventListener("click", showNextImage);

    // Close popup if clicking outside the content area
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    // Keyboard navigation for popup
    document.addEventListener("keydown", (e) => {
        if (popup.classList.contains("active")) {
            if (e.key === "Escape") {
                closePopup();
            }
            if (e.key === "ArrowLeft") {
                showPrevImage();
            }
            if (e.key === "ArrowRight") {
                showNextImage();
            }
        }
    });

});

