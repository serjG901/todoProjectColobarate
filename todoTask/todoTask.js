const getId = (() => {
    let globalID = 0;
    return () => (globalID += 1);
})();

const createTodo = (title, complete = false) => ({
    id: getId(),
    title,
    complete,
});

const createTodos = (count) =>
    Array.from({ length: count }, (value, i) => createTodo(`title${i}`));

const addTodo = (todos, newTodo) => [...todos, newTodo];

const removeTodo = (todos, todoId) =>
    todos.filter((todoItem) => todoItem.id !== todoId);

const removeCompleted = (todos) =>
    todos.filter((todoItem) => !todoItem.complete);

const changeTodoTitle = (todos, todoId, title) =>
    todos.map((todoItem) =>
        todoItem.id === todoId ? { ...todoItem, title } : todoItem
    );

const changeTodoComplete = (todos, todoId, complete) =>
    todos.map((todoItem) =>
        todoItem.id === todoId ? { ...todoItem, complete } : todoItem
    );

const setState = async (todos = []) =>
    localStorage.setItem("todos", JSON.stringify(todos));

const getTodos = async () => JSON.parse(localStorage.getItem("todos"));

const main = async () => {
    let state = {
        isLoading: true,
        todos: [],
        error: null,
    };
    // TODO: render(state);
    const fetchedTodos = await getTodos();
    state = {
        ...state,
        todos: fetchedTodos,
        isLoading: false,
    };
    // TODO: render(state);
    const updatedTodos = addTodo(todos, createTodo("New item"));
    state = {
        ...state,
        todos: updatedTodos,
    };
    // TODO: render(state);
    await setState(state.todos);
};
