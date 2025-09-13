import { getColumns, setColumns, getTasks, setTasks } from "./data.js";

const columns = getColumns();

// tasks
export function addTask(newTask, columnId) {
  const tasks = getTasks();
  let id = 0;
  tasks.forEach((task) => {
    const storedId = task.id;
    if (id < storedId) id = storedId;
  });
  id++;
  tasks.push({ id: id, name: newTask, columnId: columnId });
  setTasks(tasks);
}

export function editTask(input, taskId) {
  const tasks = getTasks();
  const item = tasks.find((task) => task.id === taskId);
  item.name = input;
  const index = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(index, 1, item);
  setTasks(tasks);
}

export function deleteTask(taskId) {
  const tasks = getTasks();
  const index = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(index, 1);
  setTasks(tasks);
}

export function clearTasks(columnId) {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((task) => task.columnId !== columnId);
  setTasks(filteredTasks);
}

// columns functions
export function addColumn(name) {
  let id = 0;
  columns.forEach((column) => {
    const storedId = column.id;
    if (id < storedId) id = storedId;
  });
  id++;
  columns.push({ id: id, name: name });
  setColumns(columns);
}

export function editColumn(input, columnId) {
  const item = columns.find((column) => column.id === columnId);
  item.name = input;
  const index = columns.findIndex((column) => column.id === columnId);
  columns.splice(index, 1, item);
  setColumns(columns);
}

export function deleteColumn(columnId) {
  const tasks = getTasks();
  const filteredTasks = tasks.filter((task) => task.columnId !== columnId);
  const index = getColumns().findIndex((column) => column.id === columnId);
  columns.splice(index, 1);
  setColumns(columns);
  setTasks(filteredTasks);
}
