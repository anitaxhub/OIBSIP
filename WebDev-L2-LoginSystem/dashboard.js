"use strict";

const current = Auth.requireAuth();     // sends visitors without a session back to the login page

if (current) {
  const user = current.user;

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function formatDateTime(timestamp) {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true,
    });
  }

  document.getElementById("welcome-title").textContent = "Welcome, " + user.username;
  document.getElementById("user-chip").textContent = user.username;
  document.getElementById("info-username").textContent = user.username;
  document.getElementById("info-email").textContent = user.email;
  document.getElementById("info-since").textContent = formatDate(user.createdAt);
  document.getElementById("info-signed-in").textContent = formatDateTime(current.session.signedInAt);
  document.getElementById("info-session-type").textContent = current.session.remember
    ? "You will stay signed in on this device."
    : "This session ends when you close the tab.";

  document.getElementById("logout-btn").addEventListener("click", function () {
    Auth.logout();
    Auth.setFlash("You have been logged out.", "success");
    window.location.replace("index.html");
  });

  // reveal the page only after the session check has passed
  document.getElementById("protected").hidden = false;

  // if the browser restores this page from its back/forward cache after logout, check again
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) window.location.reload();
  });
}
