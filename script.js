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

let columns = JSON.parse(localStorage.getItem("columns")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const starterColumns = [
  { id: 1, name: "To-Do" },
  { id: 2, name: "In-Progress" },
  { id: 3, name: "Done" },
];

function renderColumns() {
  board.innerHTML = "";

  if (columns.length < 1) {
    // --- EMPTY STATE UI ---
    const emptyStateDiv = document.createElement("div");
    emptyStateDiv.className =
      "flex flex-col items-center justify-center text-center p-12 bg-gray-100 rounded-2xl w-full mx-auto my-16 shadow-md";

    const title = document.createElement("h2");
    title.className = "text-2xl font-bold text-gray-700 mb-2";
    title.textContent = "Your Board is Empty!";

    const message = document.createElement("p");
    message.className = "text-gray-500 mb-6";
    message.textContent = "Get started by adding some columns to your board.";

    const buttonGroupDiv = document.createElement("div");
    buttonGroupDiv.className = "flex flex-col sm:flex-row gap-4 mt-8";

    // Primary Button: Add Starter Columns
    const btnAddDefaultColumns = document.createElement("button");
    btnAddDefaultColumns.className =
      "bg-sky-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-sky-700 transition shadow-md";
    btnAddDefaultColumns.textContent =
      "Add Starter Columns (To-Do, In-Progress, Done)";
    btnAddDefaultColumns.addEventListener("click", () => {
      columns = [...starterColumns];
      localStorage.setItem("columns", JSON.stringify(columns));
      renderColumns();
    });

    // Secondary Button: Add a single column manually
    const btnAddColumnManually = document.createElement("button");
    btnAddColumnManually.className =
      "text-gray-600 font-medium hover:text-black";
    btnAddColumnManually.textContent = "or, Add a Column Manually";
    btnAddColumnManually.addEventListener("click", () => {
      const label = "Add a New Column";
      const button = "Add";
      const actions = { operation: "add", type: "column" };
      openModal(label, button, actions);
    });

    buttonGroupDiv.appendChild(btnAddDefaultColumns);
    buttonGroupDiv.appendChild(btnAddColumnManually);

    emptyStateDiv.appendChild(title);
    emptyStateDiv.appendChild(message);
    emptyStateDiv.appendChild(buttonGroupDiv);

    board.appendChild(emptyStateDiv);
  } else {
    // --- RENDER EXISTING COLUMNS ---
    columns.forEach((column) => {
      const columnDiv = document.createElement("div");
      columnDiv.id = column.id;
      columnDiv.className =
        "bg-gray-100 rounded-2xl p-6 shadow-xl flex flex-col gap-6 ring-1 ring-gray-200";

      const columnHeader = document.createElement("div");
      columnHeader.className = "flex justify-between";

      const columnTitleDiv = document.createElement("div");
      columnTitleDiv.className = "flex items-center gap-3";

      const columnName = document.createElement("span");
      columnName.className = "font-bold text-gray-900 text-2xl tracking-tight";
      columnName.textContent = column.name;

      const btnEditColumn = document.createElement("button");
      btnEditColumn.innerHTML = "<i class = 'ri-edit-box-line cursor-pointer'></i>";
      btnEditColumn.dataset.colId = column.id;

      columnTitleDiv.appendChild(columnName);
      columnTitleDiv.appendChild(btnEditColumn);

      const btnDeleteColumn = document.createElement("button");
      btnDeleteColumn.innerHTML =
        "<i class = 'ri-delete-bin-6-line cursor-pointer'></i>";
      btnDeleteColumn.dataset.colId = column.id;

      columnHeader.appendChild(columnTitleDiv);
      columnHeader.appendChild(btnDeleteColumn);

      const cardGrid = document.createElement("div");
      cardGrid.className =
        "grid grid-cols-1 gap-4 border-2 border-dashed border-gray-300 p-4 rounded-xl";
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

      columnDiv.appendChild(columnHeader);
      columnDiv.appendChild(cardGrid);

      const columnTasks = tasks.filter((task) => task.columnId === column.id);
      columnTasks.forEach((task) => {
        const taskCard = document.createElement("div");
        taskCard.className =
          "card bg-white rounded-xl shadow-lg p-5 grid grid-cols-[1fr_auto] items-center gap-4 transition-all duration-200 hover:shadow-xl hover:scale-[1.01] active:cursor-grabbing";
        taskCard.draggable = "true";
        taskCard.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", task.id);
        });

        const taskName = document.createElement("span");
        taskName.textContent = task.name;
        taskName.className = "break-words whitespace-normal";

        const actionButtonsDiv = document.createElement("div");
        actionButtonsDiv.className = "flex justify-end gap-4";

        const editButton = document.createElement("button");
        editButton.innerHTML = "<i class='ri-edit-line cursor-pointer'></i>";
        editButton.dataset.taskId = task.id;
        editButton.dataset.action = "edit";
        editButton.classList.add("action");

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML =
          "<i class='ri-delete-bin-fill cursor-pointer'></i>";
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
      btnAddTask.textContent = "+ Add task";
      btnAddTask.dataset.colId = column.id;
      btnAddTask.dataset.action = "add";
      btnAddTask.className =
        "add w-full bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors duration-200";

      columnDiv.appendChild(btnAddTask);

      if (columnTasks.length > 0) {
        const btnClearTask = document.createElement("button");
        btnClearTask.textContent = "Clear all";
        btnClearTask.dataset.colId = column.id;
        btnClearTask.dataset.action = "clear";
        btnClearTask.className =
          "clear w-full bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200";
        columnDiv.appendChild(btnClearTask);
      }

      board.appendChild(columnDiv);
    });

    // --- RENDER THE "+ ADD COLUMN" BUTTON ---
    const btnAddColumn = document.createElement("button");
    btnAddColumn.id = "btnAddColumn";
    btnAddColumn.className =
      "bg-gray-100 p-12 border-2 border-dashed border-gray-400 rounded-xl text-gray-600 font-medium hover:bg-gray-200 hover:border-gray-500 transition";
    btnAddColumn.textContent = "+ Add Column";
    btnAddColumn.addEventListener("click", () => {
      const label = "Add a New Column";
      const button = "Add";
      const actions = { operation: "add", type: "column" };
      openModal(label, button, actions);
    });

    board.appendChild(btnAddColumn);
  }
}

renderColumns();

let label = "";
let button = "";
let setDisable = false;
board.addEventListener("click", (e) => {
  const addTaskButton = e.target.closest(".add");
  const taskActionButton = e.target.closest(".action");
  const clearButton = e.target.closest(".clear");

  if (addTaskButton) {
    const columnId = Number(addTaskButton.dataset.colId);
    const operation = addTaskButton.dataset.action;
    const actions = {
      id: columnId,
      operation: operation,
      type: "task",
      setDisable: setDisable,
    };
    label = "Add a task";
    button = "Add";
    openModal(label, button, actions);
    return;
  }

  if (taskActionButton) {
    const taskId = Number(taskActionButton.dataset.taskId);
    const operation = taskActionButton.dataset.action;
    const taskCard = taskActionButton.closest(".card");
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
    label = "Are you sure you want to clear all tasks?";
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
  actions.type ? (modalPrimaryButton.dataset.type = actions.type) : null;

  modal.showModal();
}

modalInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") modalPrimaryButton.click();
});

modalPrimaryButton.addEventListener("click", () => {
  const operation = modalPrimaryButton.dataset.action;
  const id = Number(modalPrimaryButton.dataset.id) || null;
  const type = modalPrimaryButton.dataset.type || null;
  let input = null;
  if (operation !== "clear") input = modalInput.value.trim();
  if (operation !== "clear" && !input) return;

  if (operation === "add" && type === "column") addNewColumn(input);
  else if (operation === "add" && type === "task") addNewTask(input, id);
  else if (operation === "edit") editTask(input, id);
  else if (operation === "delete") deleteTask(id);
  else if (operation === "clear") clearTasks(id);
  modalInput.value = "";
  modal.close();
  return;
});

// CRUD functions
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

function addNewColumn(name) {
  let id = 0;
  columns.forEach((column) => {
    const storedId = column.id;
    if (id < storedId) id = storedId;
  });
  id++;
  columns.push({ id: id, name: name });
  localStorage.setItem("columns", JSON.stringify(columns));
  renderColumns();
}
