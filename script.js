const board = document.getElementById('board')

// styles
const columnStyle = 'column'
const cardStyle = 'card'
const columnTitleStyle = 'font-semibold text-gray-800 text-xl mb-4'
const cardGridStyle = 'grid grid-cols-1 gap-4'

const columns = [
  { id: 1, name: "backlogs" },
  { id: 2, name: "in-progress" },
  { id: 3, name: "done" }
];

const tasks = [
  {id: 1, name: "Practice javascript", columnId: 2},
  {id: 2, name: "Clean the room", columnId: 1},
  {id: 3, name: "Do homeworks", columnId: 1},
  {id: 4, name: "Take a bath", columnId: 3},
  {id: 5, name: "Go to school", columnId: 3},
  {id: 6, name: "Push code to GitHub", columnId: 1}
]

//render each column
columns.forEach(column => {
  //for each column make a div
  const columnDiv = document.createElement('div')
  columnDiv.className = columnStyle

  //add the title of the column
  const columnTitle = document.createElement('p')
  columnTitle.className = columnTitleStyle
  columnTitle.textContent = column.name

  //make the container of the cards
  const cardsContainer = document.createElement('div')
  cardsContainer.className = cardGridStyle

  columnDiv.appendChild(columnTitle)
  columnDiv.appendChild(cardsContainer)

  //get all the tasks in this column
  const colTasks = tasks.filter(task => task.columnId === column.id)

  //for each tasks make a card and put it in card container
  colTasks.forEach(task => {
    const taskCard = document.createElement('div')
    taskCard.className = cardStyle
    taskCard.textContent = task.name
    cardsContainer.appendChild(taskCard)
  })

  //add the columns to the board
  board.appendChild(columnDiv)
})
