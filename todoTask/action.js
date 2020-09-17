let globalID = 0;
const todoList = document.getElementById("todoList");
const addTitle = document.getElementById("addTitle");
const addButton = document.getElementById("addButton");
const todoTemplate = (title) => {
    const globalID = getID();
    const todo = document.createElement("div");
    todo.className = "todo";
    todo.id = `todo${globalID}`;
    todo.innerHTML = `
                    <div class="todo-title" id="title${globalID}">
                              ${title}
                    </div>
                    <div class="todo-checked">
                        <input type="checkbox" id="checked${globalID}" onclick="someClick('c${globalID}')">checked
                    </div>
                    <div class="todo-edit">
                        <button class="edit-button" id="edit${globalID}" onclick="someClick('e${globalID}')">edit</button>
                    </div>
                    <div class="todo-delete">
                          <button class="delete-button" id="delete${globalID}" onclick="someClick('d${globalID}')">delete</button>
                    </div>`;
    return todo;
};
const getID = () => {
    globalID++;
    return globalID;
};

const someClick = (e) => {
    console.log(e);
    const id = e.slice(1, e.length);
    switch (e[0]) {
        case "c":
            checkTitle(id);
            break;
        case "e":
            editTitle(id);
            break;
        case "d":
            deleteTodo(id);
            break;
    }
};

const checkTitle = (id) => {
    const input = document.getElementById(`input${id}`);
    const check = document.getElementById(`checked${id}`);
    if (!input) {
        const title = document.getElementById(`title${id}`);
        title.style.textDecoration = check.checked ? "line-through" : "none";
    } else {
        check.checked = false;
    }
};

const deleteTodo = (id) => {
    const todo = document.getElementById(`todo${id}`);
    todo.remove();
};

const editTitle = (id) => {
    const check = document.getElementById(`checked${id}`);
    if (check.checked) {
        alert("Need to unchecked todo");
    } else {
        const input = document.getElementById(`input${id}`);
        if (!input) {
            const title = document.getElementById(`title${id}`);
            title.innerHTML = `<input class="todo-title" id="input${id}" value="${title.innerText}"></input><button class="edit-button" onclick="editOk(${id})">Ok</button>`;
        }
    }
};

const editOk = (id) => {
    const title = document.getElementById(`title${id}`);
    const inputTitle = document.getElementById(`input${id}`);
    title.innerHTML = inputTitle.value;
};

const addTodoInList = () => {
    if (addTitle.value !== "") {
        todoList.prepend(todoTemplate(addTitle.value));
        addTitle.value = "";
    }
};

addButton.addEventListener("click", () => {
    addTodoInList();
});

addTitle.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTodoInList();
});
