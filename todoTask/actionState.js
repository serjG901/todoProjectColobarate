const setState = (todos = [], loading = true, error = new Error()) => {
    const state = {
        todos,
        loading,
        error,
    };
    localStorage.setItem("state", JSON.stringify(state));
};

const getTodos = () =>
    localStorage.state ? JSON.parse(localStorage.state).todos : null;

const updateTodos = (todos = []) => {
    const state = { ...JSON.parse(localStorage.state), todos };
    localStorage.setItem("state", JSON.stringify(state));
};

let todos = [];

const getID = () => Math.floor(Math.random() * 100000);

const addTitle = document.getElementById("addTitle");
const addButton = document.getElementById("addButton");

addButton.addEventListener("click", () => {
    addTodoInList(todoTemplate);
});

addTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodoInList(todoTemplate);
});

const todosList = document.getElementById("todosList");

const addTodoInList = (todoTemplate) => {
    if (addTitle.value !== "") {
        todosList.prepend(todoTemplate(addTitle.value));
        addTitle.value = "";
    }
};

const createTodo = (title, complete, todoID) => {
    return {
        id: todoID,
        title,
        complete,
    };
};

const todoTemplate = (
    title,
    complete = false,
    todoID = getID(),
    isNew = true
) => {
    let todoInTodos = createTodo(title, complete, todoID);
    if (isNew) {
        todos = addTodo(todos, todoInTodos);
        setState(todos);
    }
    const todo = document.createElement("div");
    todo.className = "todo";
    todo.id = `todo${todoID}`;
    todo.innerHTML = `
                    <div class="todo-title" 
                        id="title${todoID}" 
                        style = "text-decoration:${
                            complete ? "line-through" : "none"
                        }">
                            ${title}
                    </div>
                    <div class="todo-checked">
                        <input
                            type="checkbox"
                            class="todo-checked-label"
                            id="checked${todoID}"
                            ${complete && "checked"}
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

const editTitle = (todoID) => {
    const input = document.getElementById(`input${todoID}`);
    if (!input) {
        const title = document.getElementById(`title${todoID}`);
        title.innerHTML = `<input 
                            class="todo-title" 
                            id="input${todoID}" 
                            value="${title.innerText}">
                            </input>
                            <button class="edit-button" onclick="editOk(${todoID})">
                                Ok
                            </button>`;
        title.style.textDecoration = "none";
    }
};

const checkTitle = (todoID) => {
    const input = document.getElementById(`input${todoID}`);
    const check = document.getElementById(`checked${todoID}`);
    if (!input) {
        const title = document.getElementById(`title${todoID}`);
        title.style.textDecoration = check.checked ? "line-through" : "none";
        let newTodos = changeTodoComplete(todos, todoID, check.checked);
        todos = [...newTodos];
        updateTodos(newTodos);
    }
};

const deleteTodo = (todoID) => {
    const todo = document.getElementById(`todo${todoID}`);
    let newTodos = removeTodo(todos, todoID);
    todos = [...newTodos];
    updateTodos(newTodos);
    todo.remove();
};

const editOk = (todoID) => {
    const title = document.getElementById(`title${todoID}`);
    const inputTitle = document.getElementById(`input${todoID}`);
    title.innerHTML = inputTitle.value;
    const check = document.getElementById(`checked${todoID}`);
    title.style.textDecoration = check.checked ? "line-through" : "none";
    let todoEdited = createTodo(inputTitle.value, check.checked, todoID);
    let newTodos = editedTodo(todos, todoEdited);
    todos = [...newTodos];
    updateTodos(newTodos);
};

const allTodos = document.getElementById("allTodos");
const allChecked = document.getElementById("allChecked");
const allUnchecked = document.getElementById("allUnchecked");

const displayOnlyCompleted = () => {
    allTodos.classList.remove("active-filter");
    allUnchecked.classList.remove("active-filter");
    allChecked.classList.add("active-filter");

    todosList.innerHTML = "";
    let newTodos = onlyCompleted(todos);
    renderTodos(newTodos, false);
};

const displayOnlyNotCompleted = () => {
    allTodos.classList.remove("active-filter");
    allChecked.classList.remove("active-filter");
    allUnchecked.classList.add("active-filter");

    todosList.innerHTML = "";
    let newTodos = removeCompleted(todos);
    renderTodos(newTodos, false);
};

const displayAllTodos = () => {
    allUnchecked.classList.remove("active-filter");
    allChecked.classList.remove("active-filter");
    allTodos.classList.add("active-filter");

    todosList.innerHTML = "";
    renderTodos(todos, false);
};

const addTodo = (todos, newTodo) => (todos = [...todos, newTodo]);

const removeTodo = (todos, todoID) =>
    todos.filter((todoItem) => todoItem.id !== todoID);

const removeCompleted = (todos) =>
    todos.filter((todoItem) => !todoItem.complete);

const onlyCompleted = (todos) =>
    todos.filter((todoItem) => todoItem.complete === true);

const changeTodoComplete = (todos, todoID, complete) =>
    todos.map((todoItem) =>
        todoItem.id === todoID ? { ...todoItem, complete } : todoItem
    );
const editedTodo = (todos, todoEdited) =>
    todos.map((todoItem) =>
        todoItem.id === todoEdited.id
            ? { ...todoItem, ...todoEdited }
            : todoItem
    );
const renderTodos = (todos, isNew) => {
    todos.forEach((todo) => {
        todosList.prepend(
            todoTemplate(todo.title, todo.complete, todo.id, isNew)
        );
    });
};

const ready = () => {
    let todosInState = getTodos();

    if (todosInState) {
        renderTodos(todosInState);
        todos = [...todosInState];
    } else {
        setState();
    }
};

document.addEventListener("DOMContentLoaded", ready);
