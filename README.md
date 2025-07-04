# 🧠 Smart Planner

A minimalist yet smart task planner — combining a calendar, to-do list, reminders, theme toggler, and progress visualizer, all running **100% in your browser** using localStorage.

---

## 🚀 Features

- 📝 Add tasks with date & time
- ✅ Mark tasks as completed
- 📅 Calendar with color indicators (green = all done, red = pending)
- ⏰ Task reminder via browser notification
- 📊 Doughnut chart for task progress
- 🌗 Dark/light theme toggle (with memory)
- 🧍‍♂️ Personalized greeting (based on time + name input)
- 🔄 Reset planner in one click
- 🧠 All data saved locally in `localStorage` (no sign-up required)

---

## 🎥 Preview

> Live Link - https://smart-planner-plum.vercel.app/

---

## 💡 How It Works

- When the app loads, it asks for your name
- Greets you based on time (morning/afternoon/evening)
- Tasks can be added with date + optional time
- Calendar shows task distribution
- Notification fires at scheduled task time (if browser allows it)
- Chart updates dynamically to show completed vs pending
- Theme toggle remembers your preference

---

## 📁 Project Structure

smart-planner/
├── index.html # UI & layout
├── styles.css # Responsive styling & dark mode
├── script.js # Task logic, rendering, theme, chart, etc.
└── README.md # Project guide (you’re reading it)

---

## 🛠️ Tech Used

| Tool        | Purpose                        |
|-------------|--------------------------------|
| HTML5       | Base structure                 |
| CSS3        | Styling and layout             |
| JavaScript  | Logic and interactions         |
| Chart.js    | Task progress visualization    |
| LocalStorage| Data persistence               |
| Notifications API | Task reminders           |

---

##  Future Add-Ons(Ideas)
Voice-based task creation 🎙️

Multi-day task scheduling

Google Calendar sync

Offline PWA support

## License
Licensed under the MIT License.

##  Author
Made with ❤️ by Krishna


