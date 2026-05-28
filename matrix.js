import { playerField } from "./dom.js"
import { paintShip, addStatus } from "./utils.js"
import { gameStart } from "./game.js"

export const playerContainer = []
export const computerContainer = []

export function createMatrix(player) {
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

export const playerState = {
  container: playerContainer,
  ships: [4,3,3,2,2,2,1,1,1,1],
  shipsContainer: [],
  currentShipSize: 4,
  currentShipCells: [],
  direction: null,
  showShips: true
}

export const computerState = {
  container: computerContainer,
  ships: [4,3,3,2,2,2,1,1,1,1],
  shipsContainer: [],
  currentShipSize: 4,
  currentShipCells: [],
  direction: null,
  showShips: false
}

function checkValidationCell (row, col, state) {
  if( state.container[row][col] !== EMPTY) {
      return false
  }
  for (let i = row -1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || i > 9 || j < 0 || j > 9) continue
      if (row === i && col === j) continue
      let ship = state.shipsContainer.some(ship => ship.some(coord => coord[0] === i && coord[1] === j))
      if (ship) {
        return false
      }
    }
  }
  //проверяю вторую клетку, чтобы она стояла рядом и задаю направление
  if (state.currentShipCells.length === 1) { 
    const prevRow = state.currentShipCells[0][0]
    const prevCol = state.currentShipCells[0][1]
    if ((row === prevRow - 1 || row === prevRow + 1 ) && col === prevCol) {
      state.direction = 'vertical'
      return true
    } else if ((col === prevCol - 1 || col === prevCol + 1 ) && row === prevRow) {
      state.direction = 'horizontal'
      return true
    } else {
      return false
    }}
  //Проверяю что последующие клетки идут рядом и в одном направлении
  if (state.currentShipCells.length >= 2) {
    const lastCell = state.currentShipCells[state.currentShipCells.length - 1]
    if (state.direction === 'vertical' 
      && (lastCell[0] + 1 === row || lastCell[0] - 1 === row ) 
      && lastCell[1] === col ) {
      return true
    } else if (state.direction === 'horizontal'  
      && (lastCell[1] + 1 === col || lastCell[1] - 1 === col ) && lastCell[0] === row) {
      return true
    } else {
      return false
    }
  }
  return true
}

function addShipCell (row, col, state) {
  state.currentShipCells.push([+row, +col])
  state.container[row][col] = SHIP
  if (state.showShips) {
    paintShip(row, col)
  }
}

// Получаю координаты клика игрока
playerField.addEventListener('click', (e) => {
  if (!gameStart) return
  if (playerState.ships.length === 0) return
  const row = +e.target.dataset.row
  const col = +e.target.dataset.col
  if (isNaN(row) || isNaN(col)) return
  if (!checkValidationCell(row, col, playerState)) return
  addShipCell(row, col, playerState)
  if (playerState.currentShipSize === playerState.currentShipCells.length) {
    playerState.direction = null
    playerState.ships.shift()
    playerState.currentShipSize = playerState.ships[0]
    playerState.shipsContainer.push([...playerState.currentShipCells])
    playerState.currentShipCells = []
  }

  if (playerState.ships.length === 0) {
    playerFinishedFields()
  }
    })

  function playerFinishedFields () {
    addStatus('Подождите, противник расставляет корабли...')

    setTimeout(addComputerFiled, 5000)
  }


//_______________КОМПЬЮТЕР___________________________

export function addComputerFiled () {

for (let i = 0; i < computerState.ships.length; i++) {

  computerState.currentShipSize = computerState.ships[i]
  computerState.currentShipCells = []
  computerState.direction = null

  let attempts = 0

  while (
    computerState.currentShipCells.length <
    computerState.currentShipSize
  ) {

    const row = Math.floor(Math.random() * 10)
    const col = Math.floor(Math.random() * 10)

    if (checkValidationCell(row, col, computerState)) {
      addShipCell(row, col, computerState)
    }

    attempts++

  if (attempts > 2000) {

    computerState.currentShipCells.forEach(([row, col]) => {
      computerState.container[row][col] = EMPTY
    })

    computerState.currentShipCells = []

    i--

    break
  }
}

  computerState.shipsContainer.push([
    ...computerState.currentShipCells
  ])
}
  addStatus('Игра началась. Ваш ход')
}
