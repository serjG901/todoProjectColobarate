let globalID = 0;
const todoList = document.getElementById("todoList");
const addTitle = document.getElementById("addTitle");
const addButton = document.getElementById("addButton");
const todoTemplate = (title) => {
    globalID++;
    let todo = document.createElement("div");
    todo.className = "todo";
    todo.id = `todo${globalID}`;
    todo.innerHTML = `
    
    <div class="title" id="title${globalID}">
                              ${title}
                      </div>
                      <div class="checked">
                          <input type="checkbox" id="checked${globalID}" oneclick="function(){console.log('1')}")">checked
                      </div>
                      <div class="edit">
                          <button class="edit-button" id="edit${globalID}" oneclick="function(){console.log('1')}')}">edit</button>
                      </div>
                      <div class="delete">
                          <button class="delete-button" id="delete${globalID}">delete</button>
                      </div>`;
    return todo;
};
addButton.addEventListener("click", () => {
    if (addTitle.value !== "") {
        console.log(addTitle.value);
        todoList.prepend(todoTemplate(addTitle.value));
        addTitle.value = "";
    }
});

addTitle.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    if (addTitle.value !== "") {
      console.log(addTitle.value);
      todoList.append(todoTemplate(addTitle.value));
      addTitle.value = "";
  }

  }
});