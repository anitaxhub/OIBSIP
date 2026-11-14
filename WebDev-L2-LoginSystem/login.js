"use strict";

if (!Auth.redirectIfLoggedIn()) {

  const form       = document.getElementById("login-form");
  const identifier = document.getElementById("identifier");
  const password   = document.getElementById("password");
  const remember   = document.getElementById("remember");
  const submitBtn  = document.getElementById("submit-btn");

  UI.attachPasswordToggles();
  UI.showFlash(Auth.takeFlash());

  [identifier, password].forEach(function (input) {
    input.addEventListener("input", function () {
      UI.clearFieldError(input);
      UI.clearFormError();
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    UI.clearFieldError(identifier);
    UI.clearFieldError(password);
    UI.clearFormError();

    /* empty fields get a simple reminder (this does not reveal anything about accounts) */
    let firstEmpty = null;
    if (identifier.value.trim() === "") {
      UI.setFieldError(identifier, "Please enter your username or email.");
      firstEmpty = identifier;
    }
    if (password.value === "") {
      UI.setFieldError(password, "Please enter your password.");
      firstEmpty = firstEmpty || password;
    }
    if (firstEmpty) {
      firstEmpty.focus();
      return;
    }

    UI.setBusy(submitBtn, true, "Login", "Checking...");
    const result = await Auth.login(identifier.value, password.value, remember.checked);
    UI.setBusy(submitBtn, false, "Login", "Checking...");

    if (!result.ok) {
      // one message for every kind of wrong credentials, so it never says which field was wrong
      UI.showFormError(result.message);
      password.value = "";
      password.focus();
      return;
    }

    window.location.href = "dashboard.html";
  });
}
