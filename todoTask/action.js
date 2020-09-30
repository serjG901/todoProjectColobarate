const templateNameApp = (name) =>
    `<a class="header-name" href="todoListStateV2.html">${name}</a>`;

const templateAppHistory = (todos, cursor, length) =>
    `<div class="app-history" id="appHistory">
        ${templateCounterUnchecked(getUncheckedTodo(todos).length)}
        ${templateUndoRedo(cursor, length)}
    </div>`;

const templateCounterUnchecked = (count) =>
    `<div class="app-history-count">active_todo : ${count}</div>`;

const templateUndoRedo = (cursor, length) =>
    `<div>
        <button class="app-history-button ${
            cursor === 0 ? "app-history-disable" : ""
        }" onclick="onUndo()">undo</button>
        <button class="app-history-button ${
            cursor < length ? "" : "app-history-disable"
        }" onclick="onSave()">save</button>
        <button class="app-history-button ${
            cursor === length ? "app-history-disable" : ""
        }" onclick="onRedo()">redo</button>
    </div>`;

const templateInputAddTodo = () =>
    `<form onsubmit="onAddTodo(this, event)"
                class="todo-send"
                id="addTodo">
                <input name="title"
                    class="todo-send-input"
                    type="text"
                    id="addTitle"
                    placeholder="what_to_do?"
                    autofocus
                />
                <button type="submit"
                    form="addTodo"
                    class="todo-send-button" 
                    id="addButton">
                    add
                </button>
            </form>`;

const templateFilterTodos = (filter, tag) =>
    `<div class="filter">
                        <input class="search-todo ${
                            tag ? "active-filter" : ""
                        }" 
                            onchange="onFilterTag(this)" 
                            placeholder="search_todo"
                            value="${tag ? tag : ""}">
                        </input>
                        <div class="filter-option">
                            <button type="button"
                                class="filter-option-button ${
                                    filter === null ? "active-filter" : ""
                                }"
                                onclick="showAllTodos()"
                            >
                                all_todo
                            </button>
                        </div>
                        <div class="filter-option">
                            <button type="button"
                                class="filter-option-button ${
                                    filter === "checked" ? "active-filter" : ""
                                }"
                                onclick="showCheckedTodos()"
                            >
                                checked
                            </button>
                        </div>
                        <div class="filter-option">
                            <button type="button"
                                class="filter-option-button ${
                                    filter === "unchecked"
                                        ? "active-filter"
                                        : ""
                                }"
                                onclick="showUncheckedTodos()"
                            >
                                unchecked
                            </button>
                        </div>
                    </div>`;

const templateTodoTitle = (todoID, title, checked, isEdit = false) =>
    `<form onsubmit="onSaveEditedTodo(this, event, ${todoID})" 
                    onclick="onEditTodo(${todoID})"
                    class="todo-title ${
                        checked ? "done-todo" : "active-todo"
                    } ${isEdit ? "active-input" : ""}" 
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
                        class="todo-title-input" 
                        id="input${todoID}"
                        value="${title}"
                    >
                    </input>`;

const templateTodoCheckedInput = (todoID, checked) =>
    `<div class="todo-checked"
                        >
                        <button
                            class="checked-button ${checked ? "checked" : ""}"
                            for="checked${todoID}"
                            onclick="onCheckTodo(${todoID})"
                        >checked</button>
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
                                ${templateTodoTitle(
                                    todoID,
                                    title,
                                    checked,
                                    isEdit(todoID, inEdit)
                                )}
                                ${templateTodoCheckedInput(todoID, checked)}
                                ${templateTodoDeleteButton(todoID)}
                                </div>`;

const templateTodoList = (todos, inEdit) =>
    `<div class="todos-list" id="todosList">
                            ${todos
                                .map((todo) => templateTodo(todo, inEdit))
                                .join("")}
                        </div>`;

const getUncheckedTodo = (todos) =>
    todos.filter((todoItem) => !todoItem.checked);

const getCheckedTodo = (todos) => todos.filter((todoItem) => todoItem.checked);

const getTagTodos = (todos, tag) =>
    todos.filter((todoItem) =>
        todoItem.title.indexOf(tag) != -1 ? true : false
    );

const templateTodoApp = ({ todos, inEdit, filter, tag, cursor, length }) => {
    let updateTodos =
        filter === null
            ? todos
            : filter === "checked"
            ? getCheckedTodo(todos)
            : filter === "unchecked"
            ? getUncheckedTodo(todos)
            : todos;
    if (tag) updateTodos = getTagTodos(updateTodos, tag);
    return `
        ${templateNameApp("my_todo_list")}
        ${templateAppHistory(todos, cursor, length)}
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

const addTodoInState = (todos, newTodo) => (todos = todos.concat(newTodo));

const onAddTodo = (formElement, event) => {
    event.preventDefault();
    const title = getFormData(formElement)["title"];
    if (title !== "") {
        const newTodo = createTodo(title);
        let state = getState();
        let newTodos = addTodoInState(state.todos, newTodo);
        state = {
            ...state,
            todos: newTodos,
            cursor: state.cursor + 1,
            length:
                state.length === state.cursor
                    ? state.length + 1
                    : state.cursor + 1,
            history:
                state.length === state.cursor
                    ? state.history.concat({
                          todos: newTodos,
                          inEdit: state.inEdit,
                      })
                    : state.history.slice(0, state.cursor + 1).concat({
                          todos: newTodos,
                          inEdit: state.inEdit,
                      }),
        };
        setState(state);
    }
};

const saveEditedTodo = (todos, todoEdited) =>
    todos.map((todoItem) =>
        todoItem.todoID === todoEdited.todoID
            ? { ...todoItem, ...todoEdited }
            : { ...todoItem }
    );

const onCheckTodo = (todoID) => {
    let state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    const updateTodo = { ...todoEdited, checked: !todoEdited.checked };
    let newTodos = saveEditedTodo(state.todos, updateTodo);
    state = {
        ...state,
        todos: newTodos,
        cursor: state.cursor + 1,
        length:
            state.length === state.cursor ? state.length + 1 : state.cursor + 1,
        history:
            state.length === state.cursor
                ? state.history.concat({
                      todos: newTodos,
                      inEdit: state.inEdit,
                  })
                : state.history.slice(0, state.cursor + 1).concat({
                      todos: newTodos,
                      inEdit: state.inEdit,
                  }),
    };
    setState(state);
};

const onEditTodo = (todoID) => {
    let state = getState();
    if (state.inEdit !== todoID) {
        state = {
            ...state,
            inEdit: todoID,
            cursor: state.cursor + 1,
            length:
                state.length === state.cursor
                    ? state.length + 1
                    : state.cursor + 1,
            history:
                state.length === state.cursor
                    ? state.history.concat({
                          todos: state.todos,
                          inEdit: todoID,
                      })
                    : state.history.slice(0, state.cursor + 1).concat({
                          todos: state.todos,
                          inEdit: todoID,
                      }),
        };
        setState(state);
    }
};

const onSaveEditedTodo = (formElement, event, todoID) => {
    event.preventDefault();
    const title = getFormData(formElement)["title"];
    if (title !== "") {
        let state = getState();
        const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
        const updateTodoEdited = { ...todoEdited, title: title };
        let newTodos = saveEditedTodo(state.todos, updateTodoEdited);
        state = {
            ...state,
            todos: newTodos,
            inEdit: null,
            cursor: state.cursor + 1,
            length:
                state.length === state.cursor
                    ? state.length + 1
                    : state.cursor + 1,
            history:
                state.length === state.cursor
                    ? state.history.concat({
                          todos: newTodos,
                          inEdit: null,
                      })
                    : state.history.slice(0, state.cursor + 1).concat({
                          todos: newTodos,
                          inEdit: null,
                      }),
        };
        setState(state);
    }
};

const onChangeEditedTodo = (element, todoID) => {
    const title = element.value;
    let state = getState();
    const todoEdited = state.todos.find((todo) => todo.todoID === todoID);
    const updateTodoEdited = { ...todoEdited, title: title };
    state = {
        ...state,
        inEdit: null,
        todos: saveEditedTodo(state.todos, updateTodoEdited),
    };
    setStateNotRender(state);
};

const removeTodo = (todos, todoID) =>
    todos.filter((todoItem) => todoItem.todoID !== todoID);

const onDeleteTodo = (todoID) => {
    let state = getState();
    let newTodos = removeTodo(state.todos, todoID);
    state = {
        ...state,
        todos: newTodos,
        inEdit: state.inEdit === todoID ? null : state.inEdit,
        cursor: state.cursor + 1,
        length:
            state.length === state.cursor ? state.length + 1 : state.cursor + 1,
        history:
            state.length === state.cursor
                ? state.history.concat({
                      todos: newTodos,
                      inEdit: state.inEdit,
                  })
                : state.history.slice(0, state.cursor + 1).concat({
                      todos: newTodos,
                      inEdit: state.inEdit,
                  }),
    };
    setState(state);
};

const onFilterTag = (element) => {
    const tag = element.value;
    let state = getState();
    state = { ...state, tag: tag };
    setState(state);
};

const showAllTodos = () => {
    let state = getState();
    state = { ...state, filter: null };
    setState(state);
};

const showCheckedTodos = () => {
    let state = getState();
    state = { ...state, filter: "checked" };
    setState(state);
};

const showUncheckedTodos = () => {
    let state = getState();
    state = { ...state, filter: "unchecked" };
    setState(state);
};

const onUndo = () => {
    let state = getState();
    state = { ...state, cursor: state.cursor === 0 ? 0 : (state.cursor -= 1) };
    setState(state);
};

const onRedo = () => {
    let state = getState();
    if (state.cursor < state.length) {
        state = { ...state, cursor: (state.cursor += 1) };
        setState(state);
    }
};

const onSave = () => {
    let state = getState();
    state = {
        ...state,
        length: state.cursor,
        history: state.history.slice(0, state.cursor + 1),
    };
    setState(state);
};

let stateSession = {};

const getState = () => {
    return stateSession;
};

const setState = (newState) => {
    let { todos, inEdit } = newState.history[newState.cursor];
    stateSession = { ...newState, todos, inEdit };

    setLocalStorageState(stateSession);
    render(stateSession);
};

const setStateNotRender = (newState) => {
    let { todos, inEdit } = newState.history[newState.cursor];
    stateSession = { ...newState, todos, inEdit };
    setLocalStorageState(stateSession);
};

const setLocalStorageState = (newState) => {
    localStorage.setItem("state", JSON.stringify(newState));
};

const getLocalStorageState = () =>
    localStorage.state ? JSON.parse(localStorage.getItem("state")) : null;

const ready = () => {
    const newState = getLocalStorageState();

    if (newState) {
        setState(newState);
    } else {
        const initialState = {
            todos: [],
            inEdit: null,
            filter: null,
            tag: null,
            cursor: 0,
            length: 0,
            history: [{ todos: [], inEdit: null }],
        };
        setState(initialState);
    }
};

ready();
