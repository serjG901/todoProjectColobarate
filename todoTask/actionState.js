//--------async function for state------------------
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
//-----may be dont need
const getLoading = () => JSON.parse(localStorage.state).loading;

const updateLoading = (loading = true) => {
    const state = { ...JSON.parse(localStorage.state), loading };
    localStorage.setItem("state", JSON.stringify(state));
};

const getError = () => JSON.parse(localStorage.state).error;

const updateError = (error = new Error()) => {
    const state = { ...JSON.parse(localStorage.state), error };
    localStorage.setItem("state", JSON.stringify(state));
};

//------------------action in html----------------------
let todos = [];

const getID = () => Math.floor(Math.random() * 10000);

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

const makeTodo = (title, complete, id) => {
    return {
        id: id,
        title,
        complete,
    };
};

const todoTemplate = (title, complete = false, id = getID(), all = true) => {
    const todoID = id;
    let todoInTodos = makeTodo(title, complete, id);
    if (all) {
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

const checkTitle = (id) => {
    const input = document.getElementById(`input${id}`);
    const check = document.getElementById(`checked${id}`);
    if (!input) {
        const title = document.getElementById(`title${id}`);
        title.style.textDecoration = check.checked ? "line-through" : "none";
        let newTodos = changeTodoComplete(todos, id, check.checked);
        todos = [...newTodos];
        updateTodos(newTodos);
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
    let newTodos = removeTodo(todos, id);
    todos = [...newTodos];
    updateTodos(newTodos);
    todo.remove();
};

const editOk = (id) => {
    const title = document.getElementById(`title${id}`);
    const inputTitle = document.getElementById(`input${id}`);
    title.innerHTML = inputTitle.value;
    const check = document.getElementById(`checked${id}`);
    title.style.textDecoration = check.checked ? "line-through" : "none";
    let todoEdited = makeTodo(inputTitle.value, check.checked, id);
    let newTodos = editedTodo(todos, todoEdited);
    todos = [...newTodos];
    updateTodos(newTodos);
};

const allTodos = document.getElementById("allTodos");
const allChecked = document.getElementById("allChecked");
const allUnchecked = document.getElementById("allUnchecked");

const displayOnlyCompleted = () => {
    if (
        allTodos.classList.contains("active-filter") ||
        allUnchecked.classList.contains("active-filter")
    ) {
        allTodos.classList.remove("active-filter");
        allUnchecked.classList.remove("active-filter");
        allChecked.classList.add("active-filter");
    }
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
//-----------do with todos []-------

const addTodo = (todos, newTodo) => todos.concat(newTodo);

const removeTodo = (todos, todoId) =>
    todos.filter((todoItem) => todoItem.id !== todoId);

const removeCompleted = (todos) =>
    todos.filter((todoItem) => !todoItem.complete);

const onlyCompleted = (todos) =>
    todos.filter((todoItem) => todoItem.complete === true);

const changeTodoTitle = (todos, todoId, title) => {
    return todos.map((todoItem) =>
        todoItem.id === todoId ? { ...todoItem, title } : todoItem
    );
};

const changeTodoComplete = (todos, todoId, complete) => {
    return todos.map((todoItem) =>
        todoItem.id === todoId ? { ...todoItem, complete } : todoItem
    );
};

const editedTodo = (todos, todoEdited) => {
    if (todoEdited) {
        return todos.map((todoItem) =>
            todoItem.id === todoEdited.id
                ? { ...todoItem, ...todoEdited }
                : todoItem
        );
    } else {
        throw new Error("Entering edited object not correct or null");
    }
};

//-------------action in state--------

const renderTodos = (todos, all) => {
    todos.forEach((todo) => {
        todosList.prepend(
            todoTemplate(todo.title, todo.complete, todo.id, all)
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
