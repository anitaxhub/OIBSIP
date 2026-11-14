"use strict";

if (!Auth.redirectIfLoggedIn()) {

  const form        = document.getElementById("register-form");
  const username    = document.getElementById("username");
  const email       = document.getElementById("email");
  const password    = document.getElementById("password");
  const confirmBox  = document.getElementById("confirm");
  const submitBtn   = document.getElementById("submit-btn");
  const ruleItems   = document.querySelectorAll("#password-rules li");
  const fields      = [username, email, password, confirmBox];

  UI.attachPasswordToggles();

  /* live checklist under the password box */
  function updateRules() {
    const rules = Auth.passwordRules(password.value);
    ruleItems.forEach(function (item) {
      item.classList.toggle("is-met", rules[item.dataset.rule]);
    });
  }

  password.addEventListener("input", function () {
    updateRules();
    UI.clearFieldError(password);
  });

  [username, email, confirmBox].forEach(function (input) {
    input.addEventListener("input", function () {
      UI.clearFieldError(input);
      UI.clearFormError();
    });
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    fields.forEach(UI.clearFieldError);
    UI.clearFormError();

    const values = {
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
      confirm: confirmBox.value,
    };

    /* 1. check each field */
    const problems = [];
    const usernameMessage = Auth.validateUsername(values.username);
    const emailMessage    = Auth.validateEmail(values.email);
    const passwordMessage = Auth.validatePassword(values.password);

    if (usernameMessage) problems.push([username, usernameMessage]);
    if (emailMessage)    problems.push([email, emailMessage]);
    if (passwordMessage) problems.push([password, passwordMessage]);
    if (!passwordMessage && values.confirm !== values.password) {
      problems.push([confirmBox, "The two passwords do not match."]);
    }

    if (problems.length > 0) {
      problems.forEach(function (problem) { UI.setFieldError(problem[0], problem[1]); });
      problems[0][0].focus();
      return;
    }

    /* 2. try to create the account (this also checks for duplicates) */
    UI.setBusy(submitBtn, true, "Register", "Creating account...");
    const result = await Auth.register(values);
    UI.setBusy(submitBtn, false, "Register", "Creating account...");

    if (!result.ok) {
      if (result.field === "username") {
        UI.setFieldError(username, result.message);
        username.focus();
      } else if (result.field === "email") {
        UI.setFieldError(email, result.message);
        email.focus();
      } else {
        UI.showFormError(result.message);
      }
      return;
    }

    Auth.setFlash("Account created! Please log in.", "success");
    window.location.href = "index.html";
  });
}
