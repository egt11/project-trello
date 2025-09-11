import { openModal } from "./modal.js";

const board = document.getElementById("board");

let label = "";
let button = "";
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
    button = "Add";
    openModal(label, button, actions);
    return;
  }

  if (taskActionButton) {
    const taskId = Number(taskActionButton.dataset.taskId);
    const operation = taskActionButton.dataset.action;
    const taskName = taskActionButton.dataset.taskName;

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
      type: "task",
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
      type: "task",
    };
    openModal(label, button, actions);
    return;
  }

  if (columnActionButton) {
    const columnId = Number(columnActionButton.dataset.colId);
    const operation = columnActionButton.dataset.action;
    const columnName = columnActionButton.dataset.columnName;
    modalInput.value = columnName;
    if (operation === "edit") {
      label = "Edit Column Name";
      button = "Edit";
    } else if (operation === "delete") {
      label = "Are you sure you want to delete this column?";
      button = "Delete";
      setDisable = true;
    }
    const actions = {
      id: columnId,
      operation: operation,
      type: "column",
      setDisable: setDisable,
    };
    openModal(label, button, actions);
    return;
  }
});