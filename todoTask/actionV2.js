﻿const templateNameApp = (name) => `<div class="header-name">${name}</div>`;

const templateInputAddTodo = () =>
    `<form onsubmit="onAddTodo(this, event)"
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

const templateFilterTodos = (filter) =>
    `<div class="filter">
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

const templateTodoTitle = (todoID, title, checked, isEdit = false) =>
    `<form onsubmit="onSaveEditedTodo(this, event, ${todoID})"
                class="todo-title" 
                id="title${todoID}" 
                style = "text-decoration:${
                    checked && !isEdit ? "line-through" : "none"
                }"
                name="title${todoID}"
            >
                ${isEdit ? templateTodoInEdit(todoID, title) : title}
            </form>`;
//
const templateTodoInEdit = (todoID, title) =>
    `<input onchange="onChangeEditedTodo(this, ${todoID})"
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

const templateTodoCheckedInput = (todoID, checked) =>
    `<div class="todo-checked">
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

const templateTodoEditButton = (todoID) =>
    `<div class="todo-edit">
                <button
                    class="edit-button"
                    id="edit${todoID}"
                    onclick="onEditTodo(${todoID})"
                >
                    edit
                </button>
            </div>`;

const templateTodoDeleteButton = (todoID) =>
    `<div class="todo-delete">
                <button
                    class="delete-button"
                    id="delete${todoID}"
                    onclick="onDeleteTodo(${todoID})"
                >
                    delete
                </button>
            </div>`;

const isEdit = (todoID, inEdit) => inEdit.includes(todoID);

const templateTodo = ({ todoID, title, checked }, inEdit) =>
    `<div class="todo" id="${todoID}">
            ${templateTodoTitle(todoID, title, checked, isEdit(todoID, inEdit))}
            ${templateTodoCheckedInput(todoID, checked)}
            ${templateTodoEditButton(todoID)} 
            ${templateTodoDeleteButton(todoID)}
            </div>`;

const templateTodoList = (todos, inEdit) =>
    `<div class="todos-list" id="todosList">
        ${todos.map((todo) => templateTodo(todo, inEdit)).join("")}
    </div>`;

const templateFooter = (todos) =>
    `<div class="app-footer" id="appFooter">
        ${templateCounterUnchecked(getUncheckedTodo(todos).length)}
        ${templateUndoRedo()}
    </div>`;

const templateCounterUnchecked = (count) =>
    `<div class="counter-unchecked">Active todo - ${count}</div>`;

const templateUndoRedo = () =>
    `<div><button class="app-footer-button" onclick="onUndo()">Undo</button><button class="app-footer-button" onclick="onRedo()">Redo</button></div>`;

const getUncheckedTodo = (todos) =>
    todos.filter((todoItem) => !todoItem.checked);

const getCheckedTodo = (todos) => todos.filter((todoItem) => todoItem.checked);

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
            ${templateTodoList(todos, inEdit)} 
            ${templateFooter(todos)}    
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

const addTodoInState = (todos, newTodo) => (todos = todos.concat(newTodo));

const onAddTodo = (formElement, event) => {
    event.preventDefault();
    const title = getFormData(formElement)["title"];
    const newTodo = createTodo(title);
    let state = getState();
    state.todos = addTodoInState(state.todos, newTodo);
    history.setNewState(state);
    setState();
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
    const updateTodo = { ...todoEdited, checked: !todoEdited.checked };
    state.todos = saveEditedTodo(state.todos, updateTodo);
    history.setNewState(state);
    setState();
};

const onEditTodo = (todoID) => {
    let state = getState();
    state.inEdit = state.inEdit.concat(todoID);
    history.setNewState(state);
    setState();
};

const onSaveEditedTodo = (formElement, event, todoID) => {
    event.preventDefault();
    const title = getFormData(formElement)["title"];
    let state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    const updateTodoEdited = { ...todoEdited, title: title };
    state.todos = saveEditedTodo(state.todos, updateTodoEdited);
    state.inEdit = state.inEdit.filter((id) => id !== todoID);
    history.setNewState(state);
    setState();
};

const onChangeEditedTodo = (element, todoID) => {
    const title = element.value;
    let state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    const updateTodoEdited = { ...todoEdited, title: title };
    state.todos = saveEditedTodo(state.todos, updateTodoEdited);
    setStateNotRender(state);
};

const removeTodo = (todos, todoID) =>
    todos.filter((todoItem) => todoItem.todoID !== todoID);

const onDeleteTodo = (todoID) => {
    let state = getState();
    state.todos = removeTodo(state.todos, todoID);
    state.inEdit = state.inEdit.filter((id) => id !== todoID);
    history.setNewState(state);
    setState();
};

const showAllTodos = () => {
    let state = getState();
    state.filter = null;
    history.setNewState(state);
    setState();
};

const showCheckedTodos = () => {
    let state = getState();
    state.filter = "checked";
    history.setNewState(state);
    setState();
};

const showUncheckedTodos = () => {
    let state = getState();
    state.filter = "unchecked";
    history.setNewState(state);
    setState();
};

const onUndo = () => {
    history.undoHistory();
    setState();
};

const onRedo = () => {
    history.redoHistory();
    setState();
};

let stateSession = {};

let history = {
    allState: [],
    cursor: -1,
    length: 0,
    getCursor: function () {
        return this.cursor;
    },
    getState: function () {
        return this.allState[this.getCursor()];
    },
    setNewState: function (newState) {
        this.cursor += 1;
        this.length = this.cursor + 1;
        this.allState = this.allState.slice(0, this.cursor).concat(newState);
    },
    undoHistory: function () {
        if (this.cursor > 0) this.cursor -= 1;
    },
    redoHistory: function () {
        if (this.cursor < this.length - 1) this.cursor += 1;
    },
};

const getState = () => {
    return { ...stateSession };
};

const setState = () => {
    stateSession = history.getState();
    setLocalStorageHistory(history);
    setLocalStorageState(stateSession);
    render(stateSession);
};

const setStateNotRender = (newState) => {
    stateSession = newState;
};

const setLocalStorageState = (newState) => {
    localStorage.setItem("state", JSON.stringify(newState));
};

const getLocalStorageState = () =>
    localStorage.state ? JSON.parse(localStorage.getItem("state")) : null;

const setLocalStorageHistory = (newHistory) => {
    localStorage.setItem("history", JSON.stringify(newHistory));
};

const ready = () => {
    if (getLocalStorageState()) {
        const newState = getLocalStorageState();
        history.setNewState(newState);
    }
    const newState = history.getState();

    if (newState) {
        setState();
    } else {
        const initialState = {
            todos: [],
            inEdit: [],
            filter: null,
        };
        history.setNewState(initialState);
        setLocalStorageHistory(history);
        ready();
    }
};

ready();
