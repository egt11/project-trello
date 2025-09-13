import renderColumns from "./main.js";

export const starterColumns = [
  { id: 1, name: "To-Do" },
  { id: 2, name: "In-Progress" },
  { id: 3, name: "Done" },
];

let columns = JSON.parse(localStorage.getItem("columns")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

export function getColumns() {
  return columns;
}

export function getTasks() {
  return tasks;
}

export function setColumns(newColumns) {
  columns = [...newColumns];
  localStorage.setItem("columns", JSON.stringify(columns));
  renderColumns();
}

export function setTasks(newTasks) {
  tasks = [...newTasks];
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderColumns();
}
