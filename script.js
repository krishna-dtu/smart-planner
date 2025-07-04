if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const calendar = document.getElementById("calendar");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedDate = null;

// Add a new task from top input
addTaskBtn.onclick = () => {
    const taskText = taskInput.value.trim();
    const date = taskDate.value;
    const time = document.getElementById("taskTime").value;

    if (!taskText || !date) return;

    const task = {
        text: taskText,
        date,
        time,
        completed: false,
        notified: false
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    taskDate.value = "";
    document.getElementById("taskTime").value = "";

    renderTasks();
    renderCalendar();
    renderProgressChart();
};



// Render all tasks in main list (optional)
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
      <span style="text-decoration: ${task.completed ? 'line-through' : 'none'};">
  ${task.text}
  ${task.date ? ` - ${task.date}` : ""}
  ${task.time ? ` @ ${task.time}` : ""}
</span>

      <button onclick="removeTask(${index})">❌</button>
    `;
        taskList.appendChild(li);
    });
}

// Remove from main list
function removeTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    renderCalendar();
}

// Render the calendar view
function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    calendar.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("div");
        blank.className = "calendar-day empty";
        calendar.appendChild(blank);
    }

    const todayStr = now.toLocaleDateString('en-CA'); // "YYYY-MM-DD"


    for (let day = 1; day <= lastDate; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const tasksForDay = tasks.filter(t => t.date === dateStr);
        const hasTask = tasksForDay.length > 0;
        const allDone = hasTask && tasksForDay.every(t => t.completed);


        const div = document.createElement("div");
        div.className = "calendar-day";
        div.textContent = day;

        if (hasTask) {
            div.style.background = allDone ? "#28a745" : "#ff6b6b";  // green if all done, else red
            div.style.color = "#fff"; // for contrast
        }

        if (dateStr === todayStr) div.classList.add("today");

        div.onclick = (e) => {
            showTasksPopup(dateStr, e.target);
        };

        calendar.appendChild(div);
    }
}

// Show popup near clicked date
function showTasksPopup(dateStr, anchorElement) {
    selectedDate = dateStr;
    const popup = document.getElementById("popup-task-box");
    const heading = document.getElementById("popup-date-heading");
    const list = document.getElementById("popup-task-list");

    heading.textContent = `Tasks on ${dateStr}`;
    list.innerHTML = "";

    const filtered = tasks.filter(t => t.date === dateStr);
    filtered.forEach((t, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
      <span style="text-decoration: ${t.completed ? 'line-through' : 'none'};">
        ${t.text}
      </span>
      <div>
        <button onclick="toggleDone('${t.date}', ${i})">
          ${t.completed ? '✅' : '✓'}
        </button>
        <button onclick="deleteTaskFromDate('${t.date}', ${i})">❌</button>
      </div>
    `;
        list.appendChild(li);
    });

    const rect = anchorElement.getBoundingClientRect();
    popup.style.top = `${window.scrollY + rect.top - popup.offsetHeight - 10}px`;
    popup.style.left = `${window.scrollX + rect.left}px`;
    popup.style.display = "block";
}

// Toggle done status
function toggleDone(dateStr, indexInDateFiltered) {
    const filtered = tasks.filter(t => t.date === dateStr);
    const actualTask = filtered[indexInDateFiltered];

    const realIndex = tasks.findIndex(t =>
        t.text === actualTask.text && t.date === actualTask.date
    );

    if (realIndex > -1) {
        tasks[realIndex].completed = !tasks[realIndex].completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        renderCalendar();
        renderProgressChart();
        showTasksPopup(dateStr, document.querySelector(`.calendar-day:nth-child(${realIndex + 1})`));
    }
}

// Delete from popup
function deleteTaskFromDate(dateStr, indexInDateFiltered) {
    const filtered = tasks.filter(t => t.date === dateStr);
    const actualTask = filtered[indexInDateFiltered];

    const realIndex = tasks.findIndex(t =>
        t.text === actualTask.text && t.date === actualTask.date
    );

    if (realIndex > -1) {
        tasks.splice(realIndex, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        renderCalendar();
        renderProgressChart();
        showTasksPopup(dateStr, document.querySelector(`.calendar-day:nth-child(${realIndex + 1})`));
    }
}

// Close popup if clicked outside
document.addEventListener("click", function (e) {
    const popup = document.getElementById("popup-task-box");
    if (!popup.contains(e.target) && !e.target.classList.contains("calendar-day")) {
        popup.style.display = "none";
    }
});


let chartInstance = null;

function renderProgressChart() {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;

    const ctx = document.getElementById('progressChart').getContext('2d');

    if (chartInstance) chartInstance.destroy(); // avoid duplicates

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ['#28a745', '#ffc107'],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: document.body.classList.contains('dark') ? '#eee' : '#333'
                    }
                }
            }
        }
    });
}
renderTasks();
renderCalendar();
renderProgressChart(); // Ensure this is not missing or misplaced

setInterval(() => {
    const now = new Date();
    const nowStr = now.toLocaleDateString("en-CA"); // yyyy-mm-dd
    const nowTime = now.toTimeString().slice(0, 5); // hh:mm

    tasks.forEach(task => {
        if (
            task.date === nowStr &&
            task.time === nowTime &&
            !task.completed &&
            !task.notified
        ) {
            if (Notification.permission === "granted") {
                new Notification("⏰ Task Reminder", {
                    body: `${task.text} is scheduled for now.`,
                });
                task.notified = true;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }
    });
}, 30000); // check every 30 seconds
const toggleBtn = document.getElementById("toggleThemeBtn");

const applyTheme = (mode) => {
    document.body.classList.toggle("dark", mode === "dark");
    toggleBtn.textContent = mode === "dark" ? "☀️" : "🌙";
    localStorage.setItem("theme", mode);
};

const saved = localStorage.getItem("theme") || "light";
applyTheme(saved);

toggleBtn.onclick = () => {
    const current = document.body.classList.contains("dark") ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
};
function saveUsername() {
  const name = document.getElementById("usernameInput").value.trim();
  if (name) {
    localStorage.setItem("plannerUsername", name);
    showGreeting();
  }
}

function showGreeting() {
  const storedName = localStorage.getItem("plannerUsername");
  if (storedName) {
    document.getElementById("greeting").textContent = `👋 Hello, ${storedName}!`;
    document.getElementById("usernameInput").style.display = "none";
  }
}

showGreeting(); // call on page load
function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function saveUsername() {
  const name = document.getElementById("usernameInput").value.trim();
  if (name) {
    localStorage.setItem("plannerUsername", name);
    showGreeting();
    document.getElementById("introOverlay").style.display = "none";
  }
}

function showGreeting() {
  const name = localStorage.getItem("plannerUsername");
  if (name) {
    const greet = getTimeGreeting();
    document.getElementById("greeting").textContent = `${greet}, ${name} 👋`;
  }
}

// On load: check for username
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("plannerUsername");
  if (saved) {
    document.getElementById("introOverlay").style.display = "none";
    showGreeting();
  }
});
function resetPlannerData() {
  if (confirm("Are you sure you want to clear all your planner data?")) {
    localStorage.removeItem("tasks");
    localStorage.removeItem("theme");
    localStorage.removeItem("plannerUsername");
    location.reload();  // reloads to reset the app
  }
}
