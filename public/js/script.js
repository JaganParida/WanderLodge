(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

/*checkbox for tax*/
let taxSwitch = document.getElementById("flexSwitchCheckDefault");
if (taxSwitch) {
  taxSwitch.addEventListener("click", () => {
    const taxinfo = document.getElementsByClassName("tax-info");
    for (const info of taxinfo) {
      info.style.display = info.style.display !== "inline" ? "inline" : "none";
    }
  });
}

/*filters*/
const filters = document.querySelector("#filters");
const arrowIcons = document.querySelectorAll(".icon i");
let isDragging = false;
let startX, startScrollLeft;

if (filters && arrowIcons.length >= 2) {
  // Apply touch-action to prevent browser interference
  filters.style.touchAction = "none";

  // Function to show/hide arrow icons based on scroll position
  const handleIcons = () => {
    const scrollValue = Math.round(filters.scrollLeft);
    const maxScrollableWidth = filters.scrollWidth - filters.clientWidth;
    arrowIcons[0].parentElement.style.display =
      scrollValue > 0 ? "flex" : "none";
    arrowIcons[1].parentElement.style.display =
      maxScrollableWidth > scrollValue ? "flex" : "none";
  };

  // Click event for left and right arrows (One-by-One Fast Scrolling)
  arrowIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const scrollAmount = filters.clientWidth / 4; // Scroll one item at a time
      filters.scrollBy({
        left: icon.id === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(handleIcons, 300);
    });
  });

  // Drag start event (Works on both Mouse & Touch)
  const startDrag = (e) => {
    isDragging = true;
    filters.classList.add("dragging");
    startX = e.pageX || e.touches?.[0]?.pageX;
    startScrollLeft = filters.scrollLeft;
  };

  // Drag move event (Now Works on Mobile)
  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevents browser scroll issues on mobile
    const x = e.pageX || e.touches?.[0]?.pageX;
    if (typeof x !== "number") return;
    const walk = (x - startX) * 2.5; // Adjust speed for smooth experience
    filters.scrollLeft = startScrollLeft - walk;
    handleIcons();
  };

  // Drag stop event
  const stopDrag = () => {
    isDragging = false;
    filters.classList.remove("dragging");
  };

  // Mouse events for dragging
  filters.addEventListener("mousedown", startDrag);
  filters.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);

  // Touch events for dragging (Now 100% Working on Mobile)
  filters.addEventListener("touchstart", startDrag, { passive: false });
  filters.addEventListener("touchmove", onDrag, { passive: false });
  filters.addEventListener("touchend", stopDrag);

  // Smooth scrolling with trackpad (two-finger swipe)
  filters.addEventListener(
    "wheel",
    (e) => {
      if (e.deltaX === 0 && e.deltaY === 0) return;
      e.preventDefault();
      filters.scrollLeft += e.deltaX !== 0 ? e.deltaX * 2 : e.deltaY * 3;
      handleIcons();
    },
    { passive: false }
  );

  // Disable smooth behavior for fast snapping while dragging
  filters.style.scrollBehavior = "auto";
}

/*preloader*/
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.5s ease-out";
    setTimeout(() => {
      preloader.style.display = "none";
    }, 500);
  }
});

/* Smooth scroll animations on page load */
document.addEventListener("DOMContentLoaded", function () {
  // Keep animations stable: only enable if supported, never force-hide content.
  // No extra scroll or button animations: keep things visually stable.
});

/*search input clear redirect*/
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");
  const searchForm = document.querySelector(".search-box");
  const heroSearchInput = document.querySelector(".hero-search-input");
  const heroSearchForm = document.querySelector(".hero-search-box");

  if (searchInput && searchForm) {
    let previousValue = searchInput.value.trim();

    // Listen for input changes
    searchInput.addEventListener("input", function () {
      const currentValue = this.value.trim();

      // If input is cleared and it previously had a value, redirect
      if (currentValue === "" && previousValue !== "") {
        window.location.href = "/listings";
      }

      previousValue = currentValue;
    });

    // Also handle form submission - if empty, redirect to /listings without search param
    searchForm.addEventListener("submit", function (e) {
      if (searchInput.value.trim() === "") {
        e.preventDefault();
        window.location.href = "/listings";
      }
    });
  }

  // Hero search input handling
  if (heroSearchInput && heroSearchForm) {
    heroSearchForm.addEventListener("submit", function (e) {
      if (heroSearchInput.value.trim() === "") {
        e.preventDefault();
        window.location.href = "/listings";
      }
    });
  }
});
