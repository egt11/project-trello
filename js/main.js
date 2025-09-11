import {
  getColumns,
  getTasks,
  setColumns,
  setTasks,
  starterColumns,
} from "./data.js";
import { openModal } from "./modal.js";

export default function renderColumns() {
  const columns = getColumns();
  const tasks = getTasks();
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
      setColumns(starterColumns);
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
        "column bg-gray-100 rounded-2xl p-6 shadow-xl flex flex-col gap-6 ring-1 ring-gray-200";

      const columnHeader = document.createElement("div");
      columnHeader.className = "flex justify-between";

      const columnTitleDiv = document.createElement("div");
      columnTitleDiv.className = "flex items-center gap-3";

      const columnName = document.createElement("span");
      columnName.className =
        "column-name font-bold text-gray-900 text-2xl tracking-tight";
      columnName.textContent = column.name;

      const btnEditColumn = document.createElement("button");
      btnEditColumn.innerHTML =
        "<i class = 'ri-edit-box-line cursor-pointer'></i>";
      btnEditColumn.dataset.colId = column.id;
      btnEditColumn.dataset.action = "edit";
      btnEditColumn.dataset.columnName = column.name;
      btnEditColumn.classList.add("column-action");

      columnTitleDiv.appendChild(columnName);
      columnTitleDiv.appendChild(btnEditColumn);

      const btnDeleteColumn = document.createElement("button");
      btnDeleteColumn.innerHTML =
        "<i class = 'ri-delete-bin-6-line cursor-pointer'></i>";
      btnDeleteColumn.dataset.colId = column.id;
      btnDeleteColumn.dataset.action = "delete";
      btnDeleteColumn.dataset.columnName = column.name;
      btnDeleteColumn.classList.add("column-action");

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
        setTasks(tasks);
      });

      columnDiv.appendChild(columnHeader);
      columnDiv.appendChild(cardGrid);

      //tasks
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
        taskName.className = "task-name break-words whitespace-normal";

        const actionButtonsDiv = document.createElement("div");
        actionButtonsDiv.className = "flex justify-end gap-4";

        const editButton = document.createElement("button");
        editButton.innerHTML = "<i class='ri-edit-line cursor-pointer'></i>";
        editButton.dataset.taskId = task.id;
        editButton.dataset.action = "edit";
        editButton.dataset.taskName = task.name;
        editButton.classList.add("task-action");

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML =
          "<i class='ri-delete-bin-fill cursor-pointer'></i>";
        deleteButton.dataset.taskId = task.id;
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.taskName = task.name;
        deleteButton.classList.add("task-action");

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
