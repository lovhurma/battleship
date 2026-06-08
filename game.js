import { computerField,playerField, startBtn, finishBtn, saveBtn, shipsContainer} from "./dom.js"
import {paintCellComp, paintCellPlayer, removeStyleState, addStatus, HIT, MISS, paintShip, paintAllowed, paintForbidden} from "./utils.js"

export let gameStart = false
let gameState = null

export let playerContainer = []
export let computerContainer = []

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

let turn = 'player'
let playerShipsLeft = 20
let computerShipsLeft = 20

export const EMPTY = 0
export const SHIP = 1


//СОЗДАНИЕ МАТРИЦЫ
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

if (localStorage.getItem('playerContainer')) {
  continueGame()
}

//ВАЛИДАЦИЯ ДЛЯ КОМПЬЮЕТЕРА
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
//ДОБАВЛЕНИЕ КОРАБЛЯ КОМПЬЮЕТРА
function addShipCell (row, col, state) {
  state.currentShipCells.push([+row, +col])
  state.container[row][col] = SHIP
  if (state.showShips) {
    paintShip(row, col)
  }
}

//ДОБАВЛЕНИЕ КОРАБЛЯ ИГРОКА
function addShipCellPlayer (ship) {
  playerState.shipsContainer.push([...ship])
      ship.forEach(([row, col]) => {
      playerState.container[row][col] = SHIP
      
      paintShip(row, col)
      })
}

//Создание кораблей для перетаскивания
function createShips () {
  //Полчаю размеры клетки поля, чтобы они совпадали с размером палубы корабля
  const cell = document.querySelector('.player-cell')
  const deckSize = cell.offsetWidth
  for (let i = 0; i < playerState.ships.length; i++) {
    const ship = document.createElement('div')
    let shipLength = playerState.ships[i]
    ship.classList.add(`ship-${shipLength}`, 'ship')
    ship.dataset.length = shipLength
    for (let j = 0; j < shipLength; j++) {
      const deck = document.createElement('div')
      deck.classList.add('deck')
      deck.style.width = `${deckSize}px`
      deck.style.height = `${deckSize}px`
      ship.append(deck)
    } 
    shipsContainer.append(ship)
  }
}
createShips()

//_____________________drag&drop______________________

shipsContainer.addEventListener('mousedown', (e) => {
  if (!gameStart) return
  let ship = e.target.closest('.ship')
  if (!ship) return
  let cellsShip = []
  let outField = true
//clientX/Y - координаты клика относительно окна браузера
//getBoundingClientRect - координаты элемента
//Вычисляю сдвиг чтобы корабль прилипал к курсору, т.е. насколько курсор "залез в корабль"
  let shiftX = e.clientX - ship.getBoundingClientRect().left
  let shiftY = e.clientY - ship.getBoundingClientRect().top

  ship.style.position = 'absolute'
  ship.style.zIndex = 1000

  ship.style.pointerEvents = 'none'

  moveAt(e.pageX, e.pageY)

  function moveAt (pageX, pageY) {
    //pageX, pageY КУДА БЫЛ КЛИК МЫШИ НА СТРАНИЦЕ
    ship.style.left = pageX - shiftX + 'px'
    ship.style.top = pageY - shiftY + 'px'
  }

  function onMouseMove (e) {
  moveAt(e.pageX, e.pageY)

  const shipCoord = ship.getBoundingClientRect()
  const el = document.elementFromPoint(shipCoord.left, shipCoord.top)
  const allowedCells = document.querySelectorAll('.shadow-allowed')
  allowedCells.forEach(element => element.classList.remove('shadow-allowed'))
  const forbiddenCells = document.querySelectorAll('.shadow-forbidden')
  forbiddenCells.forEach(element => element.classList.remove('shadow-forbidden'))

  cellsShip = []
  outField = true

  if (el && el.classList.contains('player-cell')) {
    //строю корабль
    const startRow = +el.dataset.row
    const startCol = +el.dataset.col
    const elemLength = +ship.dataset.length

    for (let i = 0; i < elemLength; i++) {
      cellsShip.push([startRow, startCol + i])
    }
    //Проверка выхода за поле
      outField = cellsShip.some(([row, col]) => 
      row > 9 || row < 0 || col > 9 || col < 0
    )

    const isShip = isValid(cellsShip)
    //если вне поля, выходим
    if (outField) {
      return
    } 

    //если есть корабль, запрещенный свет
    if (isShip) {
      paintForbidden(cellsShip)
    }
    //в отсальных случая можно подсвечивать зеленым
      paintAllowed(cellsShip)
    }
      }

  document.addEventListener('mousemove', onMouseMove)

  document.onmouseup = function () {
    //Проверка что клетки пустые и нет корабля
    const isShip = isValid(cellsShip)
    //если клетки не пустые или корабль вне поля
    if(outField || isShip) {
      ship.style.position = 'relative'
      ship.style.left = ''
      ship.style.top = ''
      ship.style.zIndex = ''
      shipsContainer.appendChild(ship)
    } else {
      addShipCellPlayer(cellsShip)
      playerState.ships.shift()
      ship.remove()
      if (playerState.ships.length === 0) {
        playerFinishedFields()
      }
    }
    document.removeEventListener('mousemove', onMouseMove)
    ship.style.pointerEvents = 'auto'
    ship.onmouseup = null
  }

  ship.ondragstart = function () {
    return false
  }
})
  //Функция для валидации игрока
  function isValid (cellsShip) {
    for (const [row, col] of cellsShip){
      for (let i = row -1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i < 0 || i > 9 || j < 0 || j > 9) continue
          let ship = playerState.shipsContainer.some  (ship => ship.some(coord => coord[0] === i && coord[1] === j))
            if (ship) {
              return true
            }
        }}
    }
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

//СТАРТ ИГРЫ
startBtn.addEventListener('click', () => {
  startBtn.disabled = true
  saveBtn.disabled = false
  startedGame()
  addStatus('Заполните своё поле')
})

//ФИНИШ ИГРЫ
finishBtn.addEventListener('click', () => {
  startBtn.disabled = false
  finishBtn.disabled = true
  saveBtn.disabled = true
  gameStart = false
  addStatus('Игра звершена! Чтобы начать заново, нажмите кнопку "Начать игру"')

})

//ВЫСТРЕЛ КОМПЬЮТЕРА
function computerShoot () {
  if (!gameStart) return
  if (turn === 'player') return
  let row 
  let col 

    do {
        row = Math.floor(Math.random() * 10)
        col = Math.floor(Math.random() * 10)
    } while (
      playerContainer[row][col] === MISS ||
      playerContainer[row][col] === HIT
    )

  const coordinate = playerContainer[row][col]
  if (coordinate === SHIP) {
    playerContainer[row][col] = HIT
    playerShipsLeft--
    paintCellPlayer (row, col, HIT)
    finishShip (row, col, playerState)
    if (playerShipsLeft === 0) {
      finishedGame()
    } else {
    addStatus('Противник попал! Подождите, его ход.')
    setTimeout(computerShoot, 3000)
  }}
  if (coordinate === EMPTY) {
    playerContainer[row][col] = MISS
    paintCellPlayer (row, col, MISS)
    turn = 'player'
    setTimeout(() => {
      addStatus('Ваш ход')
    }, 1000)
  }
}

//ВЫСТРЕЛ ИГРОКА
function playerShoot (row, col) {
  if (!gameStart) return
  if (turn === 'computer') return
  if (
  computerContainer[row][col] === HIT ||
  computerContainer[row][col] === MISS
) return
  const coordinate = computerContainer[row][col]
  if (coordinate === SHIP) {
    computerContainer[row][col] = HIT
    computerShipsLeft--
    paintCellComp (row, col, HIT)
    finishShip (row, col, computerState)
    if (computerShipsLeft === 0) {
      finishedGame()
    } else {
    addStatus('Вы попали! Продолжайте')}
  }
  if (coordinate === EMPTY) {
    computerContainer[row][col] = MISS
    paintCellComp (row, col, MISS)
    turn = 'computer'
    addStatus('Ход компьютера')
    setTimeout(computerShoot, 3000)
  }
}

//ФУНКЦИЯ ЗАПУСКА ИГРЫ
function startedGame () {
  finishBtn.disabled = false

  gameStart = true

  playerContainer.length = 0
  computerContainer.length = 0

  localStorage.clear()

  createMatrix(playerContainer)
  createMatrix(computerContainer)

  resetState(playerState)
  resetState(computerState)

  turn = 'player'
  playerShipsLeft = 20
  computerShipsLeft = 20

  removeStyleState()
  checkContainer(shipsContainer)
}

//ФУНКЦИЯ ФИНИША ИГРЫ
function finishedGame () {
  addStatus(playerShipsLeft === 0 ? 'Победил компьютер!' : 'Вы победили!')
  startBtn.textContent = 'Начать новую игру'

  startBtn.disabled = false
  finishBtn.disabled = true

  gameStart = false

    localStorage.clear()
  
}

//СБРОС СОСТОЯНИЯ ИГРЫ
function resetState(state) {
  state.ships = [4,3,3,2,2,2,1,1,1,1]
  state.shipsContainer = []
  state.currentShipSize = 4
  state.currentShipCells = []
  state.direction = null
}

//КЛИКИ ПО ПОЛЮ КОМПЬЮТЕРА ИГРОКОМ
computerField.addEventListener('click', (e) => {
  if (playerState.shipsContainer.length !== 10) return
  const row = +e.target.dataset.row
  const col = +e.target.dataset.col

  playerShoot(row, col)
})



//______________________СОХРАНЕНИЕ В LOCALSTORAGE___________________________

function continueGame () {
  gameState = {
  savedPlayerContainer : JSON.parse(localStorage.getItem('playerContainer')),
  savedComputerContainer : JSON.parse(localStorage.getItem('computerContainer')),
  savedPlayerState: JSON.parse(localStorage.getItem('playerState')),
  savedComputerState: JSON.parse(localStorage.getItem('computerState')),
  savedTurn : localStorage.getItem('turn'),
  savedPlayerShipsLeft : +localStorage.getItem('playerShipsLeft'),
  savedComputerShipsLeft : +localStorage.getItem('computerShipsLeft'),
  stateStatus: localStorage.getItem('stateStatus'),
  statusBtn: localStorage.getItem('statusBtn')
  }
  saveBtn.textContent = gameState.statusBtn

  turn = gameState.savedTurn
  playerShipsLeft = gameState.savedPlayerShipsLeft
  computerShipsLeft = gameState.savedComputerShipsLeft

  playerState.ships = gameState.savedPlayerState.ships
  playerState.shipsContainer = gameState.savedPlayerState.shipsContainer
  playerState.currentShipSize = gameState.savedPlayerState.currentShipSize
  playerState.currentShipCells = gameState.savedPlayerState.currentShipCells
  playerState.direction = gameState.savedPlayerState.direction

  computerState.ships = gameState.savedComputerState.ships
  computerState.shipsContainer = gameState.savedComputerState.shipsContainer
  computerState.currentShipSize = gameState.savedComputerState.currentShipSize
  computerState.currentShipCells = gameState.savedComputerState.currentShipCells
  computerState.direction = gameState.savedComputerState.direction

  playerContainer.length = 0
  computerContainer.length = 0

  playerContainer.push(...gameState.savedPlayerContainer)
  computerContainer.push(...gameState.savedComputerContainer)
  
  for (let i = 0; i < computerContainer.length; i++) {
    for (let j = 0; j < computerContainer.length; j++ ) {
      const state = computerContainer[i][j]
      if (state === 2 || state === 3) {
        paintCellComp(i, j, state)
      }
    }
  }

    for (let i = 0; i < playerContainer.length; i++) {
    for (let j = 0; j < playerContainer.length; j++ ) {
      const state = playerContainer[i][j]
      if (state === 1) {
        paintShip(i, j)
      }

      if (state === 2 || state === 3) {
        paintCellPlayer(i, j, state)
      }
    }
  }
}



saveBtn.addEventListener('click', (e) => {
  let nameBtn = e.target.textContent
  if (nameBtn === 'Сохранить игру') {
  saveBtn.textContent = 'Продолжить игру'
  startBtn.disabled = false
  gameStart = false
  addStatus('Вы поставили игру на паузу')
  localStorage.setItem('playerContainer', JSON.stringify(playerContainer))
  localStorage.setItem('computerContainer', JSON.stringify(computerContainer))
  localStorage.setItem('playerState', JSON.stringify(playerState))
  localStorage.setItem('computerState', JSON.stringify(computerState))
  localStorage.setItem('turn', turn)
  localStorage.setItem('playerShipsLeft', playerShipsLeft)
  localStorage.setItem('computerShipsLeft', computerShipsLeft)
  localStorage.setItem('stateStatus', 'Игра на паузе' )
  localStorage.setItem('statusBtn', 'Продолжить игру')
  } 
  
  if (nameBtn === 'Продолжить игру') {
    gameStart = true
    saveBtn.textContent = 'Сохранить игру'
    if (turn === 'player') {
      addStatus('Ваш ход')
    } else {
      addStatus('Ход компьютера')
      setTimeout(computerShoot, 3000)
    }
  }
})


function playerFinishedFields () {
    addStatus('Подождите, противник расставляет корабли...')

    setTimeout(addComputerFiled, 5000)
}

function checkContainer (container) {
  const ships= container.querySelectorAll('.ship')

  if (ships.length < 10) {
    container.innerHTML = ''
    createShips()
  }
}

//Окрасить клетки вокруг пораженного корабля
function finishShip (row, col, state) {
const ship = state.shipsContainer.find(el=> el.some(([r,c]) => r === row && c === col))

const isHit = ship.every(([r,c]) =>  state.container[r][c] === HIT)
if ( isHit ) {

  for (const [row, col] of ship){
      for (let i = row -1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
          if (i < 0 || i > 9 || j < 0 || j > 9) continue
          if (row === i && col === j) continue
          if (ship.some(([row, col]) => row === i && col === j)) continue
          state.container[i][j] = MISS
          paintFinishCell (i, j, state)
        }}
    }
}
}

function paintFinishCell (row, col, state) {
  if (state === playerState) {
    paintCellPlayer(row, col, MISS)
  } else {
    paintCellComp(row, col, MISS)
  }
}