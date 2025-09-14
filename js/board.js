import { openModal } from "./modal.js";

const board = document.getElementById("board");

let label = "";
let setDisable = false;
board.addEventListener("click", (e) => {
  const addTaskButton = e.target.closest(".add");
  const taskActionButton = e.target.closest(".task-action");
  const columnActionButton = e.target.closest(".column-action");
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
    openModal(label, actions);
    return;
  }

  if (taskActionButton) {
    const taskId = Number(taskActionButton.dataset.taskId);
    const operation = taskActionButton.dataset.action;
    const taskName = taskActionButton.dataset.taskName;

    modalInput.value = taskName;
    if (operation === "edit") {
      label = "Edit a task";
    } else if (operation === "delete") {
      label = "Are you sure you want to delete this task?";
      setDisable = true;
    }
    const actions = {
      id: taskId,
      operation: operation,
      type: "task",
      setDisable: setDisable,
    };
    openModal(label, actions);
    return;
  }

  if (clearButton) {
    label = "Are you sure you want to clear all tasks?";
    const columnId = Number(clearButton.dataset.colId);
    const operation = clearButton.dataset.action;
    const actions = {
      id: columnId,
      operation: operation,
      setHidden: true,
      type: "task",
    };
    openModal(label, actions);
    return;
  }

  if (columnActionButton) {
    const columnId = Number(columnActionButton.dataset.colId);
    const operation = columnActionButton.dataset.action;
    const columnName = columnActionButton.dataset.columnName;
    modalInput.value = columnName;
    if (operation === "edit") {
      label = "Edit Column Name";
    } else if (operation === "delete") {
      label = "Are you sure you want to delete this column?";
      setDisable = true;
    }
    const actions = {
      id: columnId,
      operation: operation,
      type: "column",
      setDisable: setDisable,
    };
    openModal(label, actions);
    return;
  }
});
