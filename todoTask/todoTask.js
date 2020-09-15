// ------------------------global varibals--------------------
let globalID = 0;
// -------------------------functions---------------------------
const getId = () => (globalID += 1);

const makeTodo = (title, text, complete) => {
    return {
        id: getId(),
        title,
        complete,
    };
};

const makeTodos = (n) => {
    let todos = [];
    for (let i = 1; i <= n; i++) {
        let title = `title${i}`;
        let complete = false;
        let todo = makeTodo(title, complete);
        todos = addTodo(todos, todo);
    }
    return todos;
};

const addTodo = (todos, newTodo) => todos.concat(newTodo);

const removeTodo = (todos, todoId) =>
    todos.filter((todoItem) => todoItem.id !== todoId);

const removeCompleted = (todos) =>
    todos.filter((todoItem) => !todoItem.complete);

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
//--------async function for state------------------
const setState = async (todos = [], loading = true, error = new Error()) => {
    const state = {
        todos,
        loading,
        error,
    };
    localStorage.setItem("state", JSON.stringify(state));
};

const getTodos = async () => JSON.parse(localStorage.state).todos;

const updateTodos = async (todos = []) => {
    const state = { ...JSON.parse(localStorage.state), todos };
    localStorage.setItem("state", JSON.stringify(state));
};
//-----may be dont need
const getLoading = async () => JSON.parse(localStorage.state).loading;

const updateLoading = async (loading = true) => {
    const state = { ...JSON.parse(localStorage.state), loading };
    localStorage.setItem("state", JSON.stringify(state));
};

const getError = async () => JSON.parse(localStorage.state).error;

const updateError = async (error = new Error()) => {
    const state = { ...JSON.parse(localStorage.state), error };
    localStorage.setItem("state", JSON.stringify(state));
};
