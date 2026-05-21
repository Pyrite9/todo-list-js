const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

let todos = [];

// XSS 방어 . 속성 손상 방지 . 배열에는 원본 그대로 저장하되 Display시에 개입
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function todoInit() {
    todos = JSON.parse(localStorage.getItem("todo")) || [];
    todoDisplay();
}

function handleKeyDown(event) {
    if (event.key === "Enter") {
        addTodo();
    }
}

function addTodo() {
    let todo = todoInput.value.trim();
    
    if (todo === "") return;
    
    todos.push({text: todo, done: false});
    
    todoInput.value = "";

    localStorage.setItem("todo", JSON.stringify(todos));

    todoDisplay();
}

function todoDisplay() {

    if (todos.length === 0) {
        todoList.innerHTML = `<p>할 일이 없습니다. 할 일을 추가해보세요.</p>`;
        return;
    }

    let html = "";

    for (let i = 0; i < todos.length; i++) {
        html += `
            <div id="todo-item-${i}" class="${todos[i].done ? "done" : ""}"> 
                <input type="checkbox" ${todos[i].done ? "checked" : ""} onclick="toggleDone(${i})">
                <span id="todo-text-${i}" onclick="editTodo(${i})">${escapeHtml(todos[i].text)}</span>
                <button class="deleteBtn" onclick="deleteTodo(${i})">X</button>
            </div>
        `;
    }

    todoList.innerHTML = html;

}

function toggleDone(n) {
    todos[n].done = !todos[n].done;

    localStorage.setItem("todo", JSON.stringify(todos));

    todoDisplay();
}

function editTodo(n) {
    const span = document.querySelector(`#todo-text-${n}`);

    span.outerHTML = `
        <input id="todo-text-${n}" type="text" value="${escapeHtml(todos[n].text)}" onblur="saveTodo(${n}, this.value)" onkeydown="if(event.key==='Enter') this.blur()">
    `;
}

function saveTodo(n, val) {

    if (val.trim() === "") {
        todoDisplay();
        return;
    }

    todos[n].text = val;

    localStorage.setItem("todo", JSON.stringify(todos));

    todoDisplay();
}

function deleteTodo(n) {
    todos.splice(n, 1);

    localStorage.setItem("todo", JSON.stringify(todos));

    todoDisplay();
}

todoInit();
