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

const EMPTY = 0
const SHIP = 1
const HIT = 2
const MISS = 3

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
}

function addShipCell (row, col, element) {
  currentShipCells.push([+row, +col])
  playerContainer[row][col] = SHIP
  console.log(currentShipCells)
  console.log(playerContainer[row][col])
  element.classList.add('ship')
}

// Получаю координаты клика
playerField.addEventListener('click', (e) => {
  console.log(currentShipCells.length, currentShipSize)
  if (e.target === undefined) return
  const row = +e.target.dataset.row
  const col = +e.target.dataset.col
    //Начало создания корабля, проверка не строится ли другой корабль
    if (currentShipCells.length === 0 && playerContainer[row][col] === EMPTY) {
      isBuildingShip = true
      addShipCell(row, col, e.target)
    } 
    if (checkValidationCell(row, col)) {
      addShipCell(row, col, e.target) 
      if (currentShipSize === currentShipCells.length) {
        console.log('КОРАБЛЬ ЗАВЕРШЕН')
        isBuildingShip = false
        ships.shift()
        currentShipSize = ships[0]
        shipsContainer.push(currentShipCells)
        currentShipCells = []
      }
    }
    })
