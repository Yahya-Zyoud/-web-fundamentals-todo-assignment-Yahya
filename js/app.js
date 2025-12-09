// File: js/app.js
// Student: Yahya-Zyoud (12400927)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    http://portal.almasar101.com/assignment/api

  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }
     Returns JSON with the added task.

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY
     - If "id" is omitted: returns all tasks for this student.
     - If "id=NUMBER" is provided: returns one task.

  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
     Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12400927";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 * You can use this in your code.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/**
 * TODO 1:
 * When the page loads, fetch all existing tasks for this student using:
 *   GET: API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 * Then:
 *   - Parse the JSON response.
 *   - Loop over the "tasks" array (if it exists).
 *   - For each task, create an <li> with class "task-item"
 *     and append it to #task-list.
 */

// TODO: implement load logic using fetch(...)
document.addEventListener("DOMContentLoaded", async function () {
  try {
    const url = `${API_BASE}/get.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}`;

    const resp = await fetch(url);
    const data = await resp.json();
    setStatus("");

    if (data.tasks && Array.isArray(data.tasks)) {
      data.tasks.forEach(task => renderTask(task));
    }
    else {
      setStatus("there is no tasks found");
    }
  }

  catch (error) {
    console.error(error);
    setStatus(error.message, true);
    setTimeout(() => setStatus(""), 2500);
  }

})
  ;

/**
 * TODO 2:
 * When the form is submitted:
 *   - prevent the default behaviour.
 *   - read the value from #task-input.
 *   - send a POST request using fetch to:
 *       API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 *     with headers "Content-Type: application/json"
 *     and body JSON: { title: "..." }
 *   - on success, add the new task to the DOM and clear the input.
 */
if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    // TODO: implement add-task logic here
    const title = input.value.trim();
    if (!title) {
      setStatus("please enter a valid title", true);
      return;
    }
    setStatus("Adding the task....");
    try {
      const url = `${API_BASE}/add.php?stdid=${encodeURIComponent(STUDENT_ID)}&key=${encodeURIComponent(API_KEY)}`;

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ title: title }),
      });
      const data = await resp.json();
      setStatus("");


      if (data && data.task) {
        renderTask(data.task);
        input.value = "";
        setStatus("task added.");
        setTimeout(() => setStatus(""), 1500);

      }
      else {
        setStatus("failed to add the task", true);
        setTimeout(() => setStatus(""), 2000);
      }
    }
    catch (error) {
      console.error(error);
      setStatus(error.message, true);
      setTimeout(() => setStatus(""), 2000);
    }


  });
}

/**
 * TODO 3:
 * For each task that you render, create a "Delete" button.
 * When clicked:
 *   - send a request to:
 *       API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + TASK_ID
 *   - on success, remove that <li> from the DOM.
 *
 * You can create a helper function like "renderTask(task)" that:
 *   - Creates <li>, <span> for title, and a "Delete" <button>.
 *   - Attaches a click listener to the delete button.
 *   - Appends the <li> to #task-list.
 */

// Suggested helper (you can modify it or make your own):
function renderTask(task) {
  // Expected task object fields: id, title, stdid, is_done, created_at (depends on API)
  // TODO: create the DOM elements and append them to list

  const li = document.createElement("li");
  li.className = "task-item";

  const taskTitle = document.createElement("span");
  taskTitle.textContent = task.title;
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "delete";
  deleteButton.classList.add("task-delete");
  li.appendChild(taskTitle);
  li.appendChild(deleteButton);

  list.appendChild(li);

  deleteButton.addEventListener("click", async function () {
     deleteTask(task.id ,li);

  })

}

async function deleteTask(id, liElement) {

  const url = `${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${id}`;

  if (!confirm("Delete this task?")) return;

  setStatus("deleting task....");

  try {
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.success) {
      liElement.remove();
      setStatus("task deleted....");
      setTimeout(() => setStatus(""), 1500);
    } else {
      setStatus("failed to delete task an error occured", true);
    }

  } catch (err) {
    console.error(err);
    setStatus(err.message, true);
  }
}
