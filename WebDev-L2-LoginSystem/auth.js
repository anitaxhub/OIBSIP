"use strict";

/* =====================================================================
   auth.js - shared logic for registration, login and sessions.

   IMPORTANT: this is a front-end-only demo (Approach A: HTML/CSS/JS with
   localStorage). Everything lives in the visitor's own browser, so it shows
   the concepts of authentication but is not a replacement for a real
   server-side system.
   ===================================================================== */

const Auth = (function () {

  /* ---------- Settings ---------- */
  const USERS_KEY    = "oibsip-auth-users";
  const SESSION_KEY  = "oibsip-auth-session";
  const FLASH_KEY    = "oibsip-auth-flash";
  const ATTEMPTS_KEY = "oibsip-auth-attempts";

  const ITERATIONS   = 150000;                       // PBKDF2 rounds
  const MAX_ATTEMPTS = 5;                            // wrong logins before a short lock
  const LOCK_SECONDS = 30;
  const DUMMY_SALT   = "00112233445566778899aabbccddeeff";

  const GENERIC_LOGIN_ERROR = "Incorrect username/email or password.";   // never says which one is wrong
  const CRYPTO_ERROR = "Secure password hashing is not available here. Open the page over https or from localhost.";
  const STORAGE_ERROR = "Your browser is blocking storage, so the account could not be saved.";

  /* ---------- Safe storage helpers ---------- */
  function getStore(name) {
    try { return window[name]; } catch (error) { return null; }
  }

  function readJSON(storeName, key, fallback) {
    try {
      const store = getStore(storeName);
      const raw = store ? store.getItem(key) : null;
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(storeName, key, value) {
    try {
      const store = getStore(storeName);
      if (!store) return false;
      store.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeKey(storeName, key) {
    try {
      const store = getStore(storeName);
      if (store) store.removeItem(key);
    } catch (error) { /* ignore */ }
  }

  /* ---------- Password hashing (Web Crypto API) ---------- */
  function cryptoAvailable() {
    return !!(window.crypto && window.crypto.subtle && window.crypto.getRandomValues);
  }

  function bytesToHex(bytes) {
    return Array.from(bytes, function (byte) { return byte.toString(16).padStart(2, "0"); }).join("");
  }

  function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  function newSalt() {
    return bytesToHex(window.crypto.getRandomValues(new Uint8Array(16)));
  }

  async function hashPassword(password, saltHex) {
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]
    );
    const bits = await window.crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: hexToBytes(saltHex), iterations: ITERATIONS },
      keyMaterial, 256
    );
    return bytesToHex(new Uint8Array(bits));
  }

  // compares two strings without stopping at the first difference
  function safeEqual(a, b) {
    if (a.length !== b.length) return false;
    let difference = 0;
    for (let i = 0; i < a.length; i++) {
      difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return difference === 0;
  }

  /* ---------- Validation ---------- */
  function validateUsername(value) {
    if (!value) return "Please choose a username.";
    if (!/^[A-Za-z0-9_.]{3,20}$/.test(value)) return "Use 3 to 20 letters, numbers, dots or underscores.";
    return "";
  }

  function validateEmail(value) {
    if (!value) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
    return "";
  }

  function passwordRules(password) {
    return {
      length: password.length >= 8,
      number: /\d/.test(password),
    };
  }

  function validatePassword(password) {
    if (!password) return "Please choose a password.";
    const rules = passwordRules(password);
    if (!rules.length && !rules.number) return "Password needs at least 8 characters and at least 1 number.";
    if (!rules.length) return "Password must be at least 8 characters long.";
    if (!rules.number) return "Password must include at least 1 number.";
    return "";
  }

  /* ---------- Users ---------- */
  function readUsers() {
    const users = readJSON("localStorage", USERS_KEY, []);
    return Array.isArray(users) ? users : [];
  }

  function writeUsers(users) {
    return writeJSON("localStorage", USERS_KEY, users);
  }

  function findDuplicate(users, username, email) {
    if (users.some(function (u) { return u.usernameKey === username.toLowerCase(); })) {
      return { field: "username", message: "That username is already taken." };
    }
    if (users.some(function (u) { return u.emailKey === email.toLowerCase(); })) {
      return { field: "email", message: "An account with this email already exists." };
    }
    return null;
  }

  async function register(details) {
    if (!cryptoAvailable()) return { ok: false, field: null, message: CRYPTO_ERROR };

    const username = details.username.trim();
    const email = details.email.trim();

    const duplicate = findDuplicate(readUsers(), username, email);
    if (duplicate) return { ok: false, field: duplicate.field, message: duplicate.message };

    const salt = newSalt();
    const hash = await hashPassword(details.password, salt);

    // read again, in case another tab registered the same name while we were hashing
    const users = readUsers();
    const duplicateNow = findDuplicate(users, username, email);
    if (duplicateNow) return { ok: false, field: duplicateNow.field, message: duplicateNow.message };

    users.push({
      id: newSalt(),
      username: username,
      email: email,
      usernameKey: username.toLowerCase(),
      emailKey: email.toLowerCase(),
      salt: salt,
      hash: hash,
      createdAt: Date.now(),
    });

    if (!writeUsers(users)) return { ok: false, field: null, message: STORAGE_ERROR };
    return { ok: true };
  }

  /* ---------- Login attempts (short lock after repeated failures) ---------- */
  function lockSecondsLeft() {
    const state = readJSON("localStorage", ATTEMPTS_KEY, { count: 0, lockedUntil: 0 });
    const left = Math.ceil((state.lockedUntil - Date.now()) / 1000);
    return left > 0 ? left : 0;
  }

  function recordFailure() {
    const state = readJSON("localStorage", ATTEMPTS_KEY, { count: 0, lockedUntil: 0 });
    state.count = (state.lockedUntil && state.lockedUntil < Date.now() ? 0 : state.count) + 1;
    if (state.count >= MAX_ATTEMPTS) {
      state.lockedUntil = Date.now() + LOCK_SECONDS * 1000;
      state.count = 0;
    }
    writeJSON("localStorage", ATTEMPTS_KEY, state);
  }

  function clearFailures() {
    removeKey("localStorage", ATTEMPTS_KEY);
  }

  function lockedMessage(seconds) {
    return "Too many failed attempts. Please try again in " + seconds + " seconds.";
  }

  async function login(identifier, password, remember) {
    const locked = lockSecondsLeft();
    if (locked > 0) return { ok: false, locked: true, message: lockedMessage(locked) };
    if (!cryptoAvailable()) return { ok: false, message: CRYPTO_ERROR };

    const key = identifier.trim().toLowerCase();
    const user = readUsers().find(function (u) { return u.usernameKey === key || u.emailKey === key; });

    // Always hash, even when the user does not exist, so timing does not reveal which usernames are real.
    const hash = await hashPassword(password, user ? user.salt : DUMMY_SALT);

    if (!user || !safeEqual(hash, user.hash)) {
      recordFailure();
      const nowLocked = lockSecondsLeft();
      if (nowLocked > 0) return { ok: false, locked: true, message: lockedMessage(nowLocked) };
      return { ok: false, message: GENERIC_LOGIN_ERROR };
    }

    clearFailures();
    startSession(user, remember);
    return { ok: true };
  }

  /* ---------- Sessions ---------- */
  function startSession(user, remember) {
    endSession();
    const session = { userId: user.id, signedInAt: Date.now(), remember: !!remember };
    // "Keep me signed in" uses localStorage (survives closing the browser); otherwise sessionStorage (ends with the tab).
    writeJSON(remember ? "localStorage" : "sessionStorage", SESSION_KEY, session);
  }

  function endSession() {
    removeKey("sessionStorage", SESSION_KEY);
    removeKey("localStorage", SESSION_KEY);
  }

  function getCurrent() {
    const session = readJSON("sessionStorage", SESSION_KEY, null) || readJSON("localStorage", SESSION_KEY, null);
    if (!session) return null;
    const user = readUsers().find(function (u) { return u.id === session.userId; });
    if (!user) {
      endSession();
      return null;
    }
    return { user: user, session: session };
  }

  function logout() {
    endSession();
  }

  /* ---------- One-time messages between pages ---------- */
  function setFlash(message, type) {
    writeJSON("sessionStorage", FLASH_KEY, { message: message, type: type || "info" });
  }

  function takeFlash() {
    const flash = readJSON("sessionStorage", FLASH_KEY, null);
    removeKey("sessionStorage", FLASH_KEY);
    return flash;
  }

  /* ---------- Page guards ---------- */
  function requireAuth() {
    const current = getCurrent();
    if (!current) {
      setFlash("Please log in to view that page.", "info");
      window.location.replace("index.html");
      return null;
    }
    return current;
  }

  function redirectIfLoggedIn() {
    if (getCurrent()) {
      window.location.replace("dashboard.html");
      return true;
    }
    return false;
  }

  return {
    validateUsername: validateUsername,
    validateEmail: validateEmail,
    validatePassword: validatePassword,
    passwordRules: passwordRules,
    register: register,
    login: login,
    logout: logout,
    getCurrent: getCurrent,
    requireAuth: requireAuth,
    redirectIfLoggedIn: redirectIfLoggedIn,
    setFlash: setFlash,
    takeFlash: takeFlash,
    lockSecondsLeft: lockSecondsLeft,
  };
})();

/* =====================================================================
   Small UI helpers shared by the pages
   ===================================================================== */
const UI = {
  setFieldError: function (input, message) {
    const error = document.getElementById(input.id + "-error");
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
    input.setAttribute("aria-invalid", "true");
  },

  clearFieldError: function (input) {
    const error = document.getElementById(input.id + "-error");
    if (error) {
      error.textContent = "";
      error.hidden = true;
    }
    input.removeAttribute("aria-invalid");
  },

  showFormError: function (message) {
    const box = document.getElementById("form-error");
    box.textContent = message;
    box.hidden = false;
  },

  clearFormError: function () {
    const box = document.getElementById("form-error");
    box.textContent = "";
    box.hidden = true;
  },

  showFlash: function (flash) {
    const box = document.getElementById("flash");
    if (!box || !flash) return;
    box.textContent = flash.message;
    box.className = "flash flash-" + flash.type;
    box.hidden = false;
  },

  attachPasswordToggles: function () {
    document.querySelectorAll("[data-toggle-password]").forEach(function (button) {
      const input = document.getElementById(button.dataset.togglePassword);
      button.addEventListener("click", function () {
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.textContent = show ? "Hide" : "Show";
        button.setAttribute("aria-pressed", String(show));
        button.setAttribute("aria-label", (show ? "Hide " : "Show ") + (input.id === "confirm" ? "confirm password" : "password"));
      });
    });
  },

  setBusy: function (button, busy, idleText, busyText) {
    button.disabled = busy;
    button.textContent = busy ? busyText : idleText;
  },
};
