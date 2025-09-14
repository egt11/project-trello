import {
  addTask,
  editTask,
  deleteTask,
  clearTasks,
  addColumn,
  editColumn,
  deleteColumn,
  clearAllTasks,
  deleteAllColumns,
} from "./crud_functions.js";

const modal = document.getElementById("modal");
const modalLabel = document.getElementById("modalLabel");
const modalInput = document.getElementById("modalInput");
const modalPrimaryButton = document.getElementById("modalButton");
const btnCloseModal = document.getElementById("closeModal");

btnCloseModal.addEventListener("click", () => {
  modalInput.value = "";
  modal.close();
});

export function openModal(label, actions) {
  actions.setHidden
    ? (modalInput.style.display = "none")
    : (modalInput.style.display = "block");

  if (actions.setDisable && actions.operation === "delete")
    modalInput.disabled = true;
  else modalInput.disabled = false;

  modalLabel.textContent = label;
  modalPrimaryButton.textContent = "Confirm";
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
  if (!["clear", "deleteAll", "clearAll"].includes(operation)) {
    input = modalInput.value.trim();
    if (!input) return;
  }

  //columns
  if (type === "column") {
    if (operation === "add") addColumn(input);
    else if (operation === "edit") editColumn(input, id);
    else if (operation === "delete") deleteColumn(id);
    else if (operation === "deleteAll") deleteAllColumns();
  }

  //tasks
  if (type === "task") {
    if (operation === "add") addTask(input, id);
    else if (operation === "edit") editTask(input, id);
    else if (operation === "delete") deleteTask(id);
    else if (operation === "clear") clearTasks(id);
    else if (operation === "clearAll") clearAllTasks();
  }
  modalInput.value = "";
  modal.close();
  return;
});
