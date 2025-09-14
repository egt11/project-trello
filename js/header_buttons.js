import { getColumns, getTasks, setColumns, setTasks } from "./data.js";
import { openModal } from "./modal.js";

export function toggleHeaderButtons() {
  const columns = getColumns();
  const tasks = getTasks();

  let label = "";

  const btnClearAllTasks = document.getElementById("btnClearAllTasks");
  btnClearAllTasks.addEventListener("click", () => {
    label = "Are you sure you want to clear all tasks?";
    const actions = {
      setHidden: true,
      type: "task",
      operation: "clearAll"
    };
    openModal(label, actions);
  });

  const btnDeleteAllColumns = document.getElementById("btnDeleteAllColumns");
  btnDeleteAllColumns.addEventListener("click", () => {
    label = "Are you sure you want to delete all columns?";
    const actions = {
      setHidden: true,
      type: "column",
      operation: "deleteAll"
    };
    openModal(label, actions);
  });

  btnDeleteAllColumns.classList.toggle("hidden", columns.length === 0);
  btnClearAllTasks.classList.toggle("hidden", tasks.length === 0);
}
