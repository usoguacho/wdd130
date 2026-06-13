// ==========================================================================
// World Cup Pal - shared scripts (runs on every page)
// Handles the responsive navigation toggle and the footer year.
// ==========================================================================

// Show or hide the mobile navigation menu.
function toggleNav() {
  const menu = document.querySelector("#nav-menu");
  const button = document.querySelector("#nav-toggle");
  const isOpen = menu.classList.toggle("open");

  // Conditional branching keeps the button label and ARIA state in sync.
  if (isOpen) {
    button.setAttribute("aria-expanded", "true");
    button.textContent = "\u2715"; // ✕
  } else {
    button.setAttribute("aria-expanded", "false");
    button.textContent = "\u2630"; // ☰
  }
}

// Place the current year in the footer.
function setFooterYear() {
  const yearSpan = document.querySelector("#year");
  if (yearSpan) {
    const now = new Date();
    yearSpan.textContent = `${now.getFullYear()}`;
  }
}

const navButton = document.querySelector("#nav-toggle");
if (navButton) {
  navButton.addEventListener("click", toggleNav);
}

setFooterYear();
