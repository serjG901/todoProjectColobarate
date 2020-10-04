const templateNameApp = (name) =>
    `<a 
        class="header-name" 
        href="todoList.html"
    >
        ${name}
    </a>`;

const templateAppHistory = (todos, cursor, historyLength) =>
    `<div 
        class="app-history" 
        id="appHistory"
    >
        ${templateCounterUnchecked(getUncheckedTodo(todos).length)}
        ${templateUndoRedo(cursor, historyLength)}
    </div>`;

const templateCounterUnchecked = (count) =>
    `<div class="app-history-count">
        active_todo : ${count}
    </div>`;

const templateUndoRedo = (cursor, length) =>
    `<div>
        <button 
            class="app-history-button"
            ${cursor === 0 ? "disabled" : ""} 
            onclick="onUndo()"
        >
            undo
        </button>
        <button 
            class="app-history-button"
            ${cursor + 1 === length ? "disabled" : ""}
            onclick="onRedo()"
        >
            redo
        </button>
    </div>`;

const templateInputAddTodo = () =>
    `<form 
        onsubmit="onAddTodo(this, event)"
        class="todo-send"
        id="addTodo"
    >
        <input 
            name="title"
            class="todo-send-input"
            type="text"
            id="addTitle"
            placeholder="what_to_do?"
            autofocus
        />
        <button 
            type="submit"
            form="addTodo"
            class="todo-send-button" 
            id="addButton"
            >
                add
            </button>
    </form>`;

const templateFilterTodos = (filter, tag) =>
    `<div class="filter">
        <input 
            class="search-todo ${tag ? "active-filter" : ""}" 
            onchange="onFilterTag(this)" 
            placeholder="search_todo"
            value="${tag ? tag : ""}"
        />
        <div class="filter-option">
            <button 
                type="button"
                class="filter-option-button ${
                    filter === null ? "active-filter" : ""
                }"
                onclick="showAllTodos()"
            >
                all_todo
            </button>
        </div>
        <div class="filter-option">
            <button 
                type="button"
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
                type="button"
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
    `<form 
        onsubmit="onSaveEditedTodo(this, event, ${todoID})" 
        onclick="onEditTodo(${todoID})"
        class="todo-title ${checked ? "done-todo" : "active-todo"} ${
        isEdit ? "active-input" : ""
    }" 
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
    `<input 
        name="title"
        class="todo-title-input" 
        id="input${todoID}"
        value="${title}"
    />`;

const templateTodoCheckedInput = (todoID, checked) =>
    `<div class="todo-checked">
        <button
            class="checked-button ${checked ? "checked" : ""}"
            for="checked${todoID}"
            onclick="onCheckTodo(${todoID})"
        >
            checked
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

const isEdit = (todoID, inEdit) => inEdit === todoID;

const templateTodo = ({ todoID, title, checked }, inEdit) =>
    `<div class="todo" id="${todoID}">
        ${templateTodoTitle(todoID, title, checked, isEdit(todoID, inEdit))}
        ${templateTodoCheckedInput(todoID, checked)}
        ${templateTodoDeleteButton(todoID)}
    </div>`;

const templateTodoList = (todos, inEdit) =>
    `<div 
        class="todos-list" 
        id="todosList"
    >
        ${todos.map((todo) => templateTodo(todo, inEdit)).join("")}
    </div>`;

const getUncheckedTodo = (todos) =>
    todos.filter((todoItem) => !todoItem.checked);

const getCheckedTodo = (todos) => todos.filter((todoItem) => todoItem.checked);

const getTagTodos = (todos, tag) =>
    todos.filter(
        (todoItem) =>
            todoItem.title.toLowerCase().indexOf(tag.toLowerCase()) != -1
    );

const templateTodoApp = ({ todos, inEdit, filter, tag, cursor, history }) => {
    const updateTodosFirstFilter =
        filter === null
            ? todos
            : filter === "checked"
            ? getCheckedTodo(todos)
            : filter === "unchecked"
            ? getUncheckedTodo(todos)
            : todos;
    const updateTodos = tag
        ? getTagTodos(updateTodosFirstFilter, tag)
        : updateTodosFirstFilter;
    return `
        ${templateNameApp("my_todo_list")}
        ${templateAppHistory(todos, cursor, history.length)}
        ${templateInputAddTodo()}
        ${templateFilterTodos(filter, tag)}
        ${templateTodoList(updateTodos, inEdit)}     
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

const addItemInArray = (todos, newTodo) => [...todos, newTodo];

const onAddTodo = (formElement, event) => {
    event.preventDefault();
    const title = getFormData(formElement)["title"];
    if (title === "") return;
    const newTodo = createTodo(title);
    const state = getState();
    const newTodos = addItemInArray(state.todos, newTodo);
    const newState = createState(state, newTodos, null);
    setState(newState);
};

const saveEditedTodo = (todos, todoEdited) =>
    todos.map((todoItem) =>
        todoItem.todoID === todoEdited.todoID
            ? { ...todoItem, ...todoEdited }
            : todoItem
    );

const onCheckTodo = (todoID) => {
    const state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    const updateTodo = { ...todoEdited, checked: !todoEdited.checked };
    const newTodos = saveEditedTodo(state.todos, updateTodo);
    const newState = createState(state, newTodos, null);
    setState(newState);
};

const onEditTodo = (todoID) => {
    const state = getState();
    if (state.inEdit === todoID) return;
    const newState = createState(state, state.todos, todoID);
    setState(newState);
};

const onSaveEditedTodo = (formElement, event, todoID) => {
    event.preventDefault();
    const title = getFormData(formElement)["title"];
    if (title === "") return;
    const state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    const updateTodoEdited = { ...todoEdited, title: title };
    const newTodos = saveEditedTodo(state.todos, updateTodoEdited);
    const newState = createState(state, newTodos, null);
    setState(newState);
};

const removeTodo = (todos, todoID) =>
    todos.filter((todoItem) => todoItem.todoID !== todoID);

const onDeleteTodo = (todoID) => {
    const state = getState();
    const newTodos = removeTodo(state.todos, todoID);
    const newState = createState(state, newTodos, null);
    setState(newState);
};

const onFilterTag = (element) => {
    const tag = element.value;
    const state = getState();
    const newState = { ...state, tag: tag };
    setState(newState);
};

const showAllTodos = () => {
    const state = getState();
    const newState = { ...state, filter: null };
    setState(newState);
};

const showCheckedTodos = () => {
    const state = getState();
    const newState = { ...state, filter: "checked" };
    setState(newState);
};

const showUncheckedTodos = () => {
    const state = getState();
    const newState = { ...state, filter: "unchecked" };
    setState(newState);
};

const onUndo = () => {
    const state = getState();
    if (state.cursor === 0) return;
    const newState = {
        ...state,
        cursor: state.cursor - 1,
    };
    setState(newState);
};

const onRedo = () => {
    const state = getState();
    if (state.cursor + 1 === state.history.length) return;
    const newState = { ...state, cursor: state.cursor + 1 };
    setState(newState);
};

const createHistory = (state, newTodos, inEdit) => {
    const newHistory = [
        ...state.history.slice(0, state.cursor + 1),
        {
            todos: newTodos,
            inEdit,
        },
    ];
    return newHistory;
};

const createState = (state, newTodos, inEdit) => {
    const newState = {
        ...state,
        todos: newTodos,
        cursor: state.cursor + 1,
        inEdit,
        history: createHistory(state, newTodos, inEdit),
    };
    return newState;
};

let stateSession = {};

const getState = () => {
    return stateSession;
};

const setState = (newState) => {
    const { todos, inEdit } = newState.history[newState.cursor];
    stateSession = { ...newState, todos, inEdit };
    setLocalStorageState(stateSession);
    render(stateSession);
};

const setLocalStorageState = (newState) => {
    localStorage.setItem("state", JSON.stringify(newState));
};

const getLocalStorageState = () =>
    localStorage.state ? JSON.parse(localStorage.getItem("state")) : null;

const ready = () => {
    const newState = getLocalStorageState() || {
        todos: [],
        inEdit: null,
        filter: null,
        tag: null,
        cursor: 0,
        history: [{ todos: [], inEdit: null }],
    };

    setState(newState);
};

ready();
