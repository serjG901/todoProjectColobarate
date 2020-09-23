const setState = (state) => {
    localStorage.setItem("state", JSON.stringify(state));
    render(state);
};

const setStateNotRender = (state) => {
    localStorage.setItem("state", JSON.stringify(state));
};

const getState = () =>
    localStorage.state ? JSON.parse(localStorage.getItem("state")) : null;

const templateNameApp = (name) => {
    return `<div class="header-name">${name}</div>`;
};

const templateInputAddTodo = () => {
    return `<form onsubmit="onAddTodo(this, event)"
                class="todo-send"
                id="addTodo">
                <input name="title"
                    class="todo-send-input"
                    type="text"
                    id="addTitle"
                    placeholder="what to do?"
                    autofocus
                />
                <button type="submit"
                    form="addTodo"
                    class="todo-send-button" 
                    id="addButton">
                    add todo
                </button>
            </form>`;
};

const templateFilterTodos = (filter) => {
    return `<div class="filter">
                <div class="filter-option">
                    <button
                        class="filter-option-button ${
                            filter === null ? "active-filter" : ""
                        }"
                        onclick="showAllTodos()"
                    >
                        all todo
                    </button>
                </div>
                <div class="filter-option">
                    <button
                        class="filter-option-button ${
                            filter === "checked" ? "active-filter" : ""
                        }"
                        onclick="showCheckedTodos()"
                    >
                        checked
                    </button>
                </div>
                <div class="filter-option">
                    <button
                        class="filter-option-button ${
                            filter === "unchecked" ? "active-filter" : ""
                        }"
                        onclick="showUncheckedTodos()"
                    >
                        unchecked
                    </button>
                </div>
            </div>`;
};

const templateTodoTitle = (todoID, title, checked, isEdit = false) => {
    return `<form onsubmit="onSaveEditedTodo(this, event, ${todoID})"
                class="todo-title" 
                id="title${todoID}" 
                style = "text-decoration:${
                    checked && !isEdit ? "line-through" : "none"
                }"
                name="title${todoID}"
            >
                ${isEdit ? templateTodoInEdit(todoID, title) : title}
            </form>`;
};

const templateTodoInEdit = (todoID, title) => {
    return `<input onchange="onChangeEditedTodo(${todoID})"
                name="title"
                class="todo-title" 
                id="input${todoID}"
                value="${title}"
            >
            </input>
            <button type="submit"
                class="edit-button"
                form="title${todoID}" 
            >
                Ok
            </button>`;
};

const templateTodoCheckedInput = (todoID, checked) => {
    return `<div class="todo-checked">
                <input
                    type="checkbox"
                    class="todo-checked-label"
                    id="checked${todoID}"
                    ${checked && "checked"}
                    onclick="onCheckTodo(${todoID})"
                />
                <label
                    class="todo-checked-label"
                    for="checked${todoID}"
                    onclick="onCheckTodo(${todoID})"
                >
                    checked
                </label>
            </div>`;
};

const templateTodoEditButton = (todoID) => {
    return `<div class="todo-edit">
                <button
                    class="edit-button"
                    id="edit${todoID}"
                    onclick="onEditTodo(${todoID})"
                >
                    edit
                </button>
            </div>`;
};

const templateTodoDeleteButton = (todoID) => {
    return `<div class="todo-delete">
                <button
                    class="delete-button"
                    id="delete${todoID}"
                    onclick="onDeleteTodo(${todoID})"
                >
                    delete
                </button>
            </div>`;
};

const isEdit = (todoID, inEdit) => inEdit.includes(todoID);

const templateTodo = ({ todoID, title, checked }, inEdit) => {
    return `<div class="todo" id="${todoID}">
            ${templateTodoTitle(todoID, title, checked, isEdit(todoID, inEdit))}
            ${templateTodoCheckedInput(todoID, checked)}
            ${templateTodoEditButton(todoID)} 
            ${templateTodoDeleteButton(todoID)}
            </div>`;
};

const templateTodoApp = ({ todos, inEdit, filter }) => {
    todos =
        filter === "checked"
            ? getCheckedTodo(todos)
            : filter === "unchecked"
            ? getUncheckedTodo(todos)
            : todos;

    return `
            ${templateNameApp("my_todo_list")}
            ${templateInputAddTodo()}
            ${templateFilterTodos(filter)}

            <div class="todos-list" id="todosList">
            ${todos.map((todo) => templateTodo(todo, inEdit)).join("")}
            </div>
            
            `;
};

const render = (state) => {
    const app = document.getElementById("app");
    app.innerHTML = templateTodoApp(state);
};

const getFormData = (formElement) => {
    const formData = new FormData(formElement);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
};

const getID = () => Math.floor(Math.random() * 100000);

const createTodo = (title) => {
    return {
        todoID: getID(),
        title,
        checked: false,
    };
};

const addTodoInState = (todos, newTodo) => (todos = [...todos, newTodo]);

const onAddTodo = (formElement, event) => {
    event.preventDefault();
    const title = getFormData(formElement)["title"];
    const newTodo = createTodo(title);
    let state = getState();
    state.todos = addTodoInState(state.todos, newTodo);
    setState(state);
};

const saveEditedTodo = (todos, todoEdited) =>
    todos.map((todoItem) =>
        todoItem.todoID === todoEdited.todoID
            ? { ...todoItem, ...todoEdited }
            : todoItem
    );

const onCheckTodo = (todoID) => {
    let state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    todoEdited.checked = !todoEdited.checked;
    state.todos = saveEditedTodo(state.todos, todoEdited);
    setState(state);
};

const onEditTodo = (todoID) => {
    let state = getState();
    state.inEdit.push(todoID);
    setState(state);
};

const onSaveEditedTodo = (formElement, event, todoID) => {
    event.preventDefault();
    const title = getFormData(formElement)["title"];
    let state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    todoEdited.title = title;
    state.todos = saveEditedTodo(state.todos, todoEdited);
    state.inEdit = state.inEdit.filter((id) => id !== todoID);
    setState(state);
};

const onChangeEditedTodo = (todoID) => {
    const title = document.getElementById(`input${todoID}`).value;
    let state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    todoEdited.title = title;
    state.todos = saveEditedTodo(state.todos, todoEdited);
    setStateNotRender(state);
};

const removeTodo = (todos, todoID) =>
    todos.filter((todoItem) => todoItem.todoID !== todoID);

const onDeleteTodo = (todoID) => {
    let state = getState();
    state.todos = removeTodo(state.todos, todoID);
    state.inEdit = state.inEdit.filter((id) => id !== todoID);
    setState(state);
};

const getUncheckedTodo = (todos) =>
    todos.filter((todoItem) => !todoItem.checked);

const getCheckedTodo = (todos) => todos.filter((todoItem) => todoItem.checked);

const showAllTodos = () => {
    let state = getState();
    state.filter = null;
    setState(state);
};

const showCheckedTodos = () => {
    let state = getState();
    state.filter = "checked";
    setState(state);
};

const showUncheckedTodos = () => {
    let state = getState();
    state.filter = "unchecked";
    setState(state);
};

const ready = () => {
    let state = getState();

    if (state) {
        render(state);
    } else {
        const state = {
            todos: [],
            inEdit: [],
            filter: null,
        };
        setState(state);
        ready();
    }
};

document.addEventListener("DOMContentLoaded", ready);
