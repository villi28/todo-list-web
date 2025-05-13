document.addEventListener('DOMContentLoaded', () => {
    loadTasks();

    document.getElementById('addTaskButton').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    document.getElementById('deleteAllTasksButton').addEventListener('click', showDeleteConfirmPopup);
});

function loadTasks() {
    const taskListContainer = document.getElementById('taskListContainer');
    taskListContainer.innerHTML = '';

    const tasks = getTasks();

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const taskTextSpan = document.createElement('span');
        taskTextSpan.className = 'task-text';
        taskTextSpan.textContent = task.text;

        const checkmarkSpan = document.createElement('span');
        checkmarkSpan.className = 'checkmark';
        checkmarkSpan.textContent = task.completed ? '✅' : '';

        if (task.completed) {
            li.classList.add('completed');
            taskTextSpan.classList.add('completed');
        }

        li.appendChild(taskTextSpan);
        li.appendChild(checkmarkSpan);

        li.onclick = function () {
            task.completed = !task.completed;
            saveTasks(tasks);
            loadTasks();
            checkIfAllTasksCompleted(tasks);
        };

        taskListContainer.appendChild(li);
    });
}

function getTasks() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    if (taskText === '') return;

    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);
    input.value = '';
    loadTasks();
}

function checkIfAllTasksCompleted(tasks) {
    if (tasks.length > 0 && tasks.every(task => task.completed)) {
        showCongratsPopup();
    }
}

function showCongratsPopup() {
    document.getElementById('congratsPopup').classList.remove('hidden');
    confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
    });
}

function closePopup() {
    document.getElementById('congratsPopup').classList.add('hidden');
}

function showDeleteConfirmPopup() {
    document.getElementById('deleteConfirmPopup').classList.remove('hidden');
}

function closeDeletePopup() {
    document.getElementById('deleteConfirmPopup').classList.add('hidden');
}

function confirmDelete() {
    localStorage.removeItem('tasks'); // Remove all tasks from localStorage
    loadTasks(); // Reload the task list (empty)
    closeDeletePopup(); // Close the delete confirmation popup
}
