const board = document.getElementById("board");
const modal = document.getElementById("modal");
const modalLabel = document.getElementById("modalLabel");
const modalInput = document.getElementById("modalInput");
const modalPrimaryButton = document.getElementById("modalButton");
const btnCloseModal = document.getElementById("closeModal");

btnCloseModal.addEventListener("click", () => {
  modalInput.value = "";
  modal.close();
});

// styles
const columnStyle =
  "bg-gray-300 rounded-xl shadow py-6 px-4 flex flex-col gap-4";
const cardStyle =
  "card bg-white rounded-lg shadow-md p-6 grid grid-cols-2 cursor-grab";
const columnNameStyle = "font-semibold text-gray-800 text-xl";
const cardGridStyle =
  "grid grid-cols-1 gap-4 border-2 border-dashed border-gray-400 p-4 rounded-lg";
const addButtonStyle =
  "add bg-sky-600 text-white font-semibold px-4 py-2 rounded hover:bg-sky-800 cursor-pointer";
const clearButtonStyle =
  "clear bg-slate-400 text-white font-semibold px-4 py-2 rounded hover:bg-slate-500 cursor-pointer";
const actionButtonDivStyle = "flex justify-end gap-2";

const columns = [
  { id: 1, name: "To-Do" },
  { id: 2, name: "In-progress" },
  { id: 3, name: "Done" },
];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

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
      localStorage.setItem("tasks", JSON.stringify(tasks));
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
    btnAddTask.dataset.action = "add";
    btnAddTask.className = addButtonStyle;

    const btnClearTask = document.createElement("button");
    btnClearTask.textContent = "Clear all";
    btnClearTask.dataset.colId = column.id;
    btnClearTask.dataset.action = "clear";
    btnClearTask.className = clearButtonStyle;

    columnDiv.appendChild(btnAddTask);
    if (columnTasks.length > 0) columnDiv.appendChild(btnClearTask);

    board.appendChild(columnDiv);
  });
}

renderColumns();

board.addEventListener("click", (e) => {
  const addButton = e.target.closest(".add");
  const actionButton = e.target.closest(".action");
  const clearButton = e.target.closest(".clear");
  let label = "";
  let button = "";
  let setDisable = false;
  if (addButton) {
    const columnId = Number(addButton.dataset.colId);
    const operation = addButton.dataset.action;
    const actions = {
      id: columnId,
      operation: operation,
      setDisable: setDisable,
    };
    label = "Add a task";
    button = "Add";
    openModal(label, button, actions);
    return;
  }

  if (actionButton) {
    const taskId = Number(actionButton.dataset.taskId);
    const operation = actionButton.dataset.action;
    const taskCard = actionButton.closest(".card");
    const taskName = taskCard.querySelector("span").textContent;
    modalInput.value = taskName;
    if (operation === "edit") {
      label = "Edit a task";
      button = "Edit";
    } else if (operation === "delete") {
      label = "Are you sure you want to delete this task?";
      button = "Delete";
      setDisable = true;
    }
    const actions = {
      id: taskId,
      operation: operation,
      setDisable: setDisable,
    };
    openModal(label, button, actions);
    return;
  }

  if (clearButton) {
    label = "Clear all tasks";
    button = "Clear";
    const columnId = Number(clearButton.dataset.colId);
    const operation = clearButton.dataset.action;
    const actions = {
      id: columnId,
      operation: operation,
    };
    openModal(label, button, actions);
    return;
  }
});

function openModal(label, button, actions) {
  if (actions.operation === "clear") modalInput.style.display = "none";
  else modalInput.style.display = "block";

  if (actions.setDisable && actions.operation === "delete")
    modalInput.disabled = true;
  else modalInput.disabled = false;
  modalLabel.textContent = label;
  modalPrimaryButton.textContent = button;
  modalPrimaryButton.dataset.action = actions.operation;
  modalPrimaryButton.dataset.id = actions.id;
  modal.showModal();
}

modalPrimaryButton.addEventListener("click", () => {
  const operation = modalPrimaryButton.dataset.action;
  const id = Number(modalPrimaryButton.dataset.id);
  let input = null;
  if (operation !== "clear") input = modalInput.value.trim();
  if (operation !== "clear" && !input) return;

  if (operation === "add") addNewTask(input, id);
  else if (operation === "edit") editTask(input, id);
  else if (operation === "delete") deleteTask(id);
  else if (operation === "clear") clearTasks(id);
  modalInput.value = "";
  modal.close();
  return;
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
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderColumns();
}

function editTask(input, taskId) {
  const item = tasks.find((task) => task.id === taskId);
  item.name = input;
  const index = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(index, 1, item);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderColumns();
}

function deleteTask(taskId) {
  const index = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderColumns();
}

function clearTasks(columnId) {
  tasks = tasks.filter((task) => task.columnId !== columnId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderColumns();
}
