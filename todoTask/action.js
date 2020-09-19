let globalID = 0;
const getID = () => (globalID += 1);

const addTitle = document.getElementById("addTitle");
const addButton = document.getElementById("addButton");

addButton.addEventListener("click", () => {
    addTodoInList();
});

addTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodoInList();
});

const todosList = document.getElementById("todosList");

const addTodoInList = () => {
    if (addTitle.value !== "") {
        todosList.prepend(todoTemplate(addTitle.value));
        addTitle.value = "";
    }
};

const todoTemplate = (title) => {
    const todoID = getID();
    const todo = document.createElement("div");
    todo.className = "todo";
    todo.id = `todo${todoID}`;
    todo.innerHTML = `
                    <div class="todo-title" id="title${todoID}">
                        ${title}
                    </div>
                    <div class="todo-checked">
                        <input
                            type="checkbox"
                            class="todo-checked-label"
                            id="checked${todoID}"
                            onclick="checkTitle(${todoID})"
                        />
                        <label
                            class="todo-checked-label"
                            for="checked${todoID}"
                            onclick="checkTitle(${todoID})"
                        >
                            checked
                        </label>
                    </div>
                    <div class="todo-edit">
                        <button
                            class="edit-button"
                            id="edit${todoID}"
                            onclick="editTitle(${todoID})"
                        >
                            edit
                        </button>
                    </div>
                    <div class="todo-delete">
                        <button
                            class="delete-button"
                            id="delete${todoID}"
                            onclick="deleteTodo(${todoID})"
                        >
                            delete
                        </button>
                    </div>
                    `;
    return todo;
};

const checkTitle = (id) => {
    const input = document.getElementById(`input${id}`);
    const check = document.getElementById(`checked${id}`);
    if (!input) {
        const title = document.getElementById(`title${id}`);
        title.style.textDecoration = check.checked ? "line-through" : "none";
    }
};

const editTitle = (id) => {
    const input = document.getElementById(`input${id}`);
    if (!input) {
        const title = document.getElementById(`title${id}`);
        title.innerHTML = `<input 
                            class="todo-title" 
                            id="input${id}" 
                            value="${title.innerText}">
                            </input>
                            <button class="edit-button" onclick="editOk(${id})">
                                Ok
                            </button>`;
        title.style.textDecoration = "none";
    }
};

const deleteTodo = (id) => {
    const todo = document.getElementById(`todo${id}`);
    todo.remove();
};

const editOk = (id) => {
    const title = document.getElementById(`title${id}`);
    const inputTitle = document.getElementById(`input${id}`);
    title.innerHTML = inputTitle.value;
    const check = document.getElementById(`checked${id}`);
    title.style.textDecoration = check.checked ? "line-through" : "none";
};