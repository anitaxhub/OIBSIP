"use strict";

/* ---------- DOM references ---------- */
const form           = document.getElementById("add-form");
const taskInput      = document.getElementById("task-input");
const formError      = document.getElementById("form-error");
const pendingList    = document.getElementById("pending-list");
const completedList  = document.getElementById("completed-list");
const pendingCount   = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");
const pendingEmpty   = document.getElementById("pending-empty");
const completedEmpty = document.getElementById("completed-empty");
const todayEl        = document.getElementById("today");

/* ---------- State ---------- */
const STORAGE_KEY = "oibsip-todo-tasks";
let tasks = loadTasks();        // [{ id, text, completed, createdAt, completedAt }]
let editingId = null;           // id of the task currently being edited (or null)
let editError = "";             // validation message for the edit box
let focusEditBox = false;       // true right after "Edit" is pressed

/* ---------- localStorage (wrapped in try/catch in case storage is blocked) ---------- */
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved.filter(function (item) {
      return item && typeof item.id === "string" && typeof item.text === "string";
    });
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    /* storage unavailable: the app still works, it just will not remember tasks */
  }
}

/* ---------- Helpers ---------- */
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function cleanText(rawText) {
  return rawText.trim().replace(/\s+/g, " ");
}

function validateText(text) {
  if (text === "") return "Please type a task first.";
  return "";
}

/* ---------- Task actions ---------- */
function addTask(text) {
  tasks.push({
    id: makeId(),
    text: text,
    completed: false,
    createdAt: Date.now(),
    completedAt: null,
  });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find(function (item) { return item.id === id; });
  if (!task) return;
  task.completed = !task.completed;
  task.completedAt = task.completed ? Date.now() : null;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (item) { return item.id !== id; });
  if (editingId === id) {
    editingId = null;
    editError = "";
  }
  saveTasks();
  render();
}

function startEdit(id) {
  editingId = id;
  editError = "";
  focusEditBox = true;
  render();
}

function cancelEdit() {
  editingId = null;
  editError = "";
  render();
}

function saveEdit(id, rawText) {
  const text = cleanText(rawText);
  const message = validateText(text);
  if (message) {
    editError = message;
    focusEditBox = true;
    render();
    return;
  }
  const task = tasks.find(function (item) { return item.id === id; });
  if (task) task.text = text;
  editingId = null;
  editError = "";
  saveTasks();
  render();
}

/* ---------- Building one task row ---------- */
function createButton(label, className, ariaLabel, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-small " + className;
  button.textContent = label;
  button.setAttribute("aria-label", ariaLabel);
  button.addEventListener("click", onClick);
  return button;
}

function createTaskItem(task) {
  const item = document.createElement("li");
  item.className = "task";
  if (task.completed) item.classList.add("is-done");

  /* "Mark Complete" toggle */
  const check = document.createElement("label");
  check.className = "check";
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", (task.completed ? "Move back to pending: " : "Mark complete: ") + task.text);
  checkbox.addEventListener("change", function () { toggleTask(task.id); });
  const box = document.createElement("span");
  box.className = "check-box";
  check.append(checkbox, box);

  const body = document.createElement("div");
  body.className = "task-body";
  const actions = document.createElement("div");
  actions.className = "task-actions";

  if (editingId === task.id) {
    /* inline edit mode */
    item.classList.add("is-editing");

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.maxLength = 120;
    editInput.value = task.text;
    editInput.setAttribute("aria-label", "Edit task text");
    if (editError) editInput.setAttribute("aria-invalid", "true");
    editInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        saveEdit(task.id, editInput.value);
      } else if (event.key === "Escape") {
        cancelEdit();
      }
    });
    body.append(editInput);

    if (editError) {
      const message = document.createElement("p");
      message.className = "edit-error";
      message.setAttribute("role", "alert");
      message.textContent = editError;
      body.append(message);
    }

    actions.append(
      createButton("Save", "btn-save", "Save changes", function () { saveEdit(task.id, editInput.value); }),
      createButton("Cancel", "", "Cancel editing", cancelEdit)
    );

    if (focusEditBox) {
      focusEditBox = false;
      setTimeout(function () { editInput.focus(); editInput.select(); }, 0);
    }
  } else {
    /* normal view */
    const text = document.createElement("p");
    text.className = "task-text";
    text.textContent = task.text;                    // textContent keeps user input safe

    const meta = document.createElement("p");
    meta.className = "task-meta";
    const added = document.createElement("time");
    added.dateTime = new Date(task.createdAt).toISOString();
    added.textContent = "Added " + formatTime(task.createdAt);
    meta.append(added);
    if (task.completed && task.completedAt) {
      const done = document.createElement("time");
      done.dateTime = new Date(task.completedAt).toISOString();
      done.textContent = " \u00B7 Completed " + formatTime(task.completedAt);
      meta.append(done);
    }

    body.append(text, meta);
    actions.append(
      createButton("Edit", "", "Edit task: " + task.text, function () { startEdit(task.id); }),
      createButton("Delete", "btn-danger", "Delete task: " + task.text, function () { deleteTask(task.id); })
    );
  }

  body.append(actions);
  item.append(check, body);
  return item;
}

/* ---------- Render everything ---------- */
function render() {
  const pending = tasks
    .filter(function (task) { return !task.completed; })
    .sort(function (a, b) { return b.createdAt - a.createdAt; });          // newest first

  const completed = tasks
    .filter(function (task) { return task.completed; })
    .sort(function (a, b) { return b.completedAt - a.completedAt; });      // most recently finished first

  pendingList.replaceChildren(...pending.map(createTaskItem));
  completedList.replaceChildren(...completed.map(createTaskItem));

  pendingCount.textContent   = pending.length + " pending";
  completedCount.textContent = completed.length + " completed";

  pendingEmpty.hidden   = pending.length > 0;
  completedEmpty.hidden = completed.length > 0;
}

/* ---------- Add form ---------- */
function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
  taskInput.setAttribute("aria-invalid", "true");
}

function clearFormError() {
  formError.textContent = "";
  formError.hidden = true;
  taskInput.setAttribute("aria-invalid", "false");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const text = cleanText(taskInput.value);
  const message = validateText(text);
  if (message) {
    showFormError(message);
    taskInput.focus();
    return;
  }
  clearFormError();
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

taskInput.addEventListener("input", clearFormError);

/* ---------- Start ---------- */
todayEl.textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
render();
