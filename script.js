const board = document.getElementById("board");

// styles
const columnStyle =
  "bg-gray-300 rounded-xl shadow py-6 px-4 flex flex-col gap-4";
const cardStyle = "bg-white rounded-lg shadow-md p-6 grid grid-cols-2";
const columnNameStyle = "font-semibold text-gray-800 text-xl";
const cardGridStyle =
  "grid grid-cols-1 gap-4 border-2 border-dashed border-gray-400 p-4 rounded-lg";
const addButtonStyle =
  "add bg-sky-600 text-white font-semibold px-4 py-2 rounded hover:bg-sky-800 cursor-pointer";
const actionButtonDivStyle = "flex justify-end gap-2";

const columns = [
  { id: 1, name: "backlogs" },
  { id: 2, name: "in-progress" },
  { id: 3, name: "done" },
];

//hardcoded tasks
const tasks = [
  { id: 1, name: "Practice javascript", columnId: 2 },
  { id: 2, name: "Clean the room", columnId: 1 },
  { id: 3, name: "Do homeworks", columnId: 1 },
  { id: 4, name: "Take a bath", columnId: 3 },
  { id: 5, name: "Go to school", columnId: 3 },
  { id: 6, name: "Push code to GitHub", columnId: 1 },
  { id: 7, name: "Listen to spotify", columnId: 2 },
];

function renderColumns() {
  board.innerHTML = "";

  columns.forEach((column) => {
    const columnDiv = document.createElement("div");
    columnDiv.id = column.id;
    columnDiv.className = columnStyle;

    const columnName = document.createElement("p");
    columnName.className = columnNameStyle;
    columnName.textContent = column.name;

    const cardGrid = document.createElement("div");
    cardGrid.className = cardGridStyle;
    cardGrid.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    cardGrid.addEventListener("drop", (e) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("text/plain");
      const taskCard = tasks.find((task) => task.id === Number(taskId));
      taskCard.columnId = column.id;
      renderColumns();
    });

    columnDiv.appendChild(columnName);
    columnDiv.appendChild(cardGrid);

    const columnTasks = tasks.filter((task) => task.columnId === column.id);
    columnTasks.forEach((task) => {
      const taskCard = document.createElement("div");
      taskCard.className = cardStyle;
      taskCard.draggable = "true";
      taskCard.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
      });

      const taskName = document.createElement("span");
      taskName.textContent = task.name;
      taskName.className = "break-words whitespace-normal";

      const actionButtonsDiv = document.createElement("div");
      actionButtonsDiv.className = actionButtonDivStyle;

      const editButton = document.createElement("button");
      editButton.innerHTML =
        "<i class='fa-regular fa-pen-to-square cursor-pointer'></i>";
      editButton.dataset.taskId = task.id;
      editButton.dataset.action = "edit";
      editButton.classList.add("action");

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML =
        "<i class='fa-solid fa-trash cursor-pointer'></i>";
      deleteButton.dataset.taskId = task.id;
      deleteButton.dataset.action = "delete";
      deleteButton.classList.add("action");

      actionButtonsDiv.appendChild(editButton);
      actionButtonsDiv.appendChild(deleteButton);

      taskCard.appendChild(taskName);
      taskCard.appendChild(actionButtonsDiv);

      cardGrid.appendChild(taskCard);
    });

    const btnAddTask = document.createElement("button");
    btnAddTask.textContent = "Add task";
    btnAddTask.dataset.colId = column.id;
    btnAddTask.className = addButtonStyle;

    columnDiv.appendChild(btnAddTask);

    board.appendChild(columnDiv);
  });
}

renderColumns();

board.addEventListener("click", (e) => {
  const addButton = e.target.closest(".add");
  const actionButton = e.target.closest(".action");
  if (addButton) {
    const columnId = Number(addButton.dataset.colId);
    const newTask = window.prompt("Enter new task");
    if (!newTask) return;
    addNewTask(newTask, columnId);
    return;
  }

  if (actionButton) {
    const taskId = Number(actionButton.dataset.taskId);
    const action = actionButton.dataset.action;

    if (action === "edit") editTask(taskId);
    else if (action === "delete") deleteTask(taskId);

    return;
  }
});

// CRUD
function addNewTask(newTask, columnId) {
  let id = 0;
  tasks.forEach((task) => {
    const storedId = task.id;
    if (id < storedId) id = storedId;
  });
  id++;
  tasks.push({ id: id, name: newTask, columnId: columnId });
  renderColumns();
}

function editTask(taskId) {
  const newTaskName = window.prompt("Enter new task name: ");
  if (!newTaskName) return;
  const item = tasks.find((task) => task.id === taskId);
  item.name = newTaskName;
  const index = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(index, 1, item);
  renderColumns();
}

function deleteTask(taskId) {
  const index = tasks.findIndex((task) => task.id === taskId);
  if (window.confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    renderColumns();
  } else return;
}
