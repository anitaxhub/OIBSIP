"use strict";

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById("menu-toggle");
const navLinks   = document.getElementById("nav-links");

function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", function () {
  setMenu(!navLinks.classList.contains("is-open"));
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () { setMenu(false); });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") setMenu(false);
});

/* ---------- Highlight the nav link of the section on screen ---------- */
const links = Array.from(navLinks.querySelectorAll("a"));
const sections = links
  .map(function (link) { return document.querySelector(link.getAttribute("href")); })
  .filter(Boolean);
sections.unshift(document.getElementById("hero"));      // when the hero is on screen, no link is highlighted

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  sections.forEach(function (section) { observer.observe(section); });
}

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
