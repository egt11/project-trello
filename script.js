const board = document.getElementById("board");

// styles
const columnStyle = "column";
const cardStyle = "card";
const columnNameStyle = "font-semibold text-gray-800 text-xl";
const cardGridStyle = "grid grid-cols-1 gap-4";
const addButtonStyle =
  "add bg-sky-600 text-white font-semibold px-4 py-2 rounded hover:bg-sky-800 cursor-pointer";

const columns = [
  { id: 1, name: "backlogs" },
  { id: 2, name: "in-progress" },
  { id: 3, name: "done" },
];

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
    columnDiv.className = columnStyle;

    const columnName = document.createElement("p");
    columnName.className = columnNameStyle;
    columnName.textContent = column.name;

    columnDiv.appendChild(columnName);

    const cardGrid = document.createElement("div");
    cardGrid.className = cardGridStyle;

    columnDiv.appendChild(cardGrid);

    const columnTasks = tasks.filter((task) => task.columnId === column.id);
    columnTasks.forEach((task) => {
      const taskCard = document.createElement("div");
      taskCard.className = cardStyle;

      const taskName = document.createElement('span');
      taskName.textContent = task.name
      
      const actionButtonsDiv = document.createElement('div');

      const editButton = document.createElement('button');
      editButton.innerHTML = "<i class='fa-regular fa-pen-to-square mx-2 cursor-pointer'></i>";
      editButton.dataset.taskId = task.id;
      editButton.classList.add('edit');

      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = "<i class='fa-solid fa-trash mx-2 cursor-pointer'></i>";
      deleteButton.dataset.taskId = task.id;
      deleteButton.classList.add('delete')

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
  const editButton = e.target.closest(".edit");
  const deleteButton = e.target.closest(".delete");
  if (addButton) {
    const columnId = Number(addButton.dataset.colId);
    const newTask = window.prompt("Enter new task");
    if (!newTask) return;
    addNewTask(newTask, columnId);
    return;
  }

  if(editButton){
    const taskId = Number(editButton.dataset.taskId);
    return;
  }

  if(deleteButton){
    const taskId = Number(deleteButton.dataset.taskId);
    return;
  }
});

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

function editTask(){
  
}
