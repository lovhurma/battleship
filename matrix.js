import { playerField } from "./dom.js"

export const playerContainer = []
export const computerContainer = []

function createMatrix(player) {
  for (let i = 0; i < 10; i++) {
    player[i] = []

    for (let j = 0; j < 10; j++) {
      player[i][j] = 0
    }
  }
}

createMatrix(playerContainer)
createMatrix(computerContainer)

export const EMPTY = 0
export const SHIP = 1

let isBuildingShip = false;/// в процессе построения корабля или нет
const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1] //какой корабль строим
const shipsContainer = [] //Контейнер для уже построенных кораблей
let currentShipSize = ships[0] //текущая длина корабля
let currentShipCells = [] // координаты корабля
let direction = null

function checkValidationCell (row, col) {

  if( playerContainer[row][col] !== EMPTY) {
      return false
  }
  for (let i = row -1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || i > 9 || j < 0 || j > 9) continue
      if (row === i && col === j) continue
      let ship = shipsContainer.some(ship => ship.some(coord => coord[0] === i && coord[1] === j))
      if (ship) {
        console.log('НЕЛЬЗЯ НАЖИМАТЬ')
        return false
      }
    }
  }
  //проверяю вторую клетку, чтобы она стояла рядом и задаю направление
  if (currentShipCells.length === 1) { 
    const nextRow = currentShipCells[0][0]
    const nextCol = currentShipCells[0][1]
    if ((row === nextRow - 1 || row === nextRow + 1 ) && col === nextCol) {
      direction = 'vertical'
      return true
    } else if ((col === nextCol - 1 || col === nextCol + 1 ) && row === nextRow) {
      direction = 'horizontal'
      return true
    } else {
      return false
    }}
  //Проверяю что последующие клетки идут рядом и в одном направлении
  if (currentShipCells.length >= 2) {
    const lastCell = currentShipCells[currentShipCells.length - 1]
    if (direction === 'vertical' 
      && (lastCell[0] + 1 === row || lastCell[0] - 1 === row ) 
      && lastCell[1] === col ) {
      return true
    } else if (direction === 'horizontal'  
      && (lastCell[1] + 1 === col || lastCell[1] - 1 === col ) && lastCell[0] === row) {
      return true
    } else {
      return false
    }
  }
  return true
}

function addShipCell (row, col, element) {
  currentShipCells.push([+row, +col])
  playerContainer[row][col] = SHIP
  element.classList.add('ship')
}

// Получаю координаты клика игрока
playerField.addEventListener('click', (e) => {
  const row = +e.target.dataset.row
  const col = +e.target.dataset.col
  if (isNaN(row) || isNaN(col)) return
    //Начало создания корабля, проверка не строится ли другой корабль
    if (currentShipCells.length === 0 && checkValidationCell(row, col)) {
      isBuildingShip = true
      addShipCell(row, col, e.target)
    } else if (checkValidationCell(row, col)) {
      addShipCell(row, col, e.target) 
      if (currentShipSize === currentShipCells.length) {
        console.log('КОРАБЛЬ ЗАВЕРШЕН')
        isBuildingShip = false
        direction = null
        ships.shift()
        currentShipSize = ships[0]
        shipsContainer.push(currentShipCells)
        console.log(shipsContainer)
        currentShipCells = []
      }
    }
    })


//_______________КОМПЬЮТЕР___________________________

let computerIsBuildingShip = false; /// в процессе построения корабля или нет
const computerShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1] //какой корабль строим
const computerShipsContainer = [] //Контейнер для уже построенных кораблей
let computerCurrentShipSize = computerShips[0] //текущая длина корабля
let computerCurrentShipCells = [] // координаты корабля
let computerDirection = null

function checkValidationCellComputer(row, col, computerContainer) {

  if (computerContainer[row][col] !== EMPTY) {
    return false
  }

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {

      if (i < 0 || i > 9 || j < 0 || j > 9) continue
      if (row === i && col === j) continue

      let ship = computerShipsContainer.some(ship =>
        ship.some(coord => coord[0] === i && coord[1] === j)
      )

      if (ship) {
        return false
      }
    }
  }

  if (computerCurrentShipCells.length === 1) {
    const nextRow = computerCurrentShipCells[0][0]
    const nextCol = computerCurrentShipCells[0][1]

    if ((row === nextRow - 1 || row === nextRow + 1) && col === nextCol) {
      computerDirection = 'vertical'
      return true
    } else if ((col === nextCol - 1 || col === nextCol + 1) && row === nextRow) {
      computerDirection = 'horizontal'
      return true
    } else {
      return false
    }
  }

  if (computerCurrentShipCells.length >= 2) {
    const lastCell = computerCurrentShipCells[computerCurrentShipCells.length - 1]

    if (
      computerDirection === 'vertical' &&
      (lastCell[0] + 1 === row || lastCell[0] - 1 === row) &&
      lastCell[1] === col
    ) {
      return true
    } else if (
      computerDirection === 'horizontal' &&
      (lastCell[1] + 1 === col || lastCell[1] - 1 === col) &&
      lastCell[0] === row
    ) {
      return true
    } else {
      return false
    }
  }

  return true
}

function paintComputerShip(row, col) {
  const cell = document.querySelector(
    `.computer-cell[data-row="${row}"][data-col="${col}"]`
  )

  if (cell) {
    cell.classList.add('ship')
  }
}

function addShipCellComputer(row, col, computerContainer) {
  computerCurrentShipCells.push([+row, +col])
  computerContainer[row][col] = SHIP
  paintComputerShip(row, col)
}

for (let i = 0; i < computerShips.length; i++) {

  computerCurrentShipSize = computerShips[i]
  computerCurrentShipCells = []
  computerDirection = null

  let attempts = 0

  while (computerCurrentShipCells.length < computerCurrentShipSize) {

    let row = Math.floor(Math.random() * 10)
    let col = Math.floor(Math.random() * 10)

    if (checkValidationCellComputer(row, col, computerContainer)) {
      addShipCellComputer(row, col, computerContainer)
    }

    attempts++
    if (attempts > 2000) break
  }

  computerShipsContainer.push([...computerCurrentShipCells])
}
