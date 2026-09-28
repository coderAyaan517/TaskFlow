const columns = document.querySelectorAll(".task-column");
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const tasks = document.querySelectorAll(".task");
let tasksData = {};
let dragElement = null;

const toggleModal = document.querySelector("#toggleModal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
const addNewTask = document.querySelector("#addNewTask");

if (localStorage.getItem("kanbanTasks")) {
    const data = JSON.parse(localStorage.getItem("kanbanTasks"));

    for (const col in data) {
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => { addTask(task.title, task.description, column) });
    }

    updateTaskCount();
}

tasks.forEach(task => {
    task.addEventListener("drag", e => { dragElement = task });
});

toggleModal.addEventListener("click", () => { modal.classList.toggle("active") });
modalBg.addEventListener("click", () => { modal.classList.remove("active") });

addNewTask.addEventListener("click", () => {
    const taskTitle = document.querySelector("#taskTitle").value;
    const taskDescription = document.querySelector("#taskDescription").value;

    addTask(taskTitle, taskDescription, todo);
    updateTaskCount();

    modal.classList.remove("active");

    document.querySelector("#taskTitle").value = "";
    document.querySelector("#taskDescription").value = "";
});

function updateTaskCount() {
    columns.forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        tasksData[col.id] = Array.from(tasks).map(task => { 
            return { title: task.querySelector("h2").textContent, description: task.querySelector("p").textContent };
        });

        localStorage.setItem("kanbanTasks", JSON.stringify(tasksData));
        count.textContent = tasks.length;
    });
}

function addTask(title, description, column) {
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    <button>Delete</button>`;

    const deleteBtn = div.querySelector("button");

    column.appendChild(div);

    div.addEventListener("drag", () => { dragElement = div });

    deleteBtn.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    });
}

function addDragEvent() {
    columns.forEach(column => {
        column.addEventListener("dragenter", e => {
            e.preventDefault();
            column.classList.add("hover-over");
        });

        column.addEventListener("dragleave", e => {
            e.preventDefault();
            column.classList.remove("hover-over");
        });

        column.addEventListener("dragover", e => {
            e.preventDefault();
        });

        column.addEventListener("drop", e => {
            e.preventDefault();

            column.appendChild(dragElement);
            column.classList.remove("hover-over");

            updateTaskCount();
        });
    });
}

addDragEvent();
