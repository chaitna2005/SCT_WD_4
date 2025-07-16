const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskList = document.getElementById('taskList');

let tasks = [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem('tasks');
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' task-completed' : '');

    // Task details div (click to toggle complete)
    const details = document.createElement('div');
    details.className = 'task-details';
    details.textContent = task.title;
    details.addEventListener('click', () => toggleComplete(index));

    // Date/time display if set
    if(task.datetime) {
      const dt = document.createElement('span');
      dt.className = 'task-datetime';
      const dateObj = new Date(task.datetime);
      dt.textContent = dateObj.toLocaleString();
      details.appendChild(dt);
    }

    // Actions: Edit, Delete
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(index));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(index));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(details);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

function addTask(title, datetime) {
  tasks.push({ title, datetime, completed: false });
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function editTask(index) {
  const newTitle = prompt("Edit task title:", tasks[index].title);
  if (newTitle !== null && newTitle.trim() !== "") {
    tasks[index].title = newTitle.trim();

    // Optionally, edit datetime
    const newDate = prompt("Edit task date/time (YYYY-MM-DDTHH:mm):", tasks[index].datetime || "");
    if (newDate !== null) {
      tasks[index].datetime = newDate || null;
    }

    saveTasks();
    renderTasks();
  }
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = taskInput.value.trim();
  const datetime = taskDate.value ? taskDate.value : null;
  if (title) {
    addTask(title, datetime);
    taskInput.value = '';
    taskDate.value = '';
  }
});

window.addEventListener('load', () => {
  loadTasks();
  renderTasks();
});
