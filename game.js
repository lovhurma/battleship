import { playerContainer, computerContainer, createMatrix, EMPTY, SHIP, playerState, computerState } from "./matrix.js";
import { computerField, startBtn, finishBtn} from "./dom.js"
import {paintCellComp, paintCellPlayer, removeStyleState, addStatus, HIT, MISS} from "./utils.js"

export let gameStart = false

let turn = 'player'
let playerShipsLeft = 20
let computerShipsLeft = 20

startBtn.addEventListener('click', () => {
  startBtn.disabled = true
  startedGame()
  addStatus('Заполните своё поле')
})

finishBtn.addEventListener('click', () => {
  startBtn.disabled = false
  startedGame()
  addStatus('')

})

function computerShoot () {
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

function playerShoot (row, col) {
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

function startedGame () {
  finishBtn.disabled = false

  gameStart = true

  playerContainer.length = 0
  computerContainer.length = 0

  createMatrix(playerContainer)
  createMatrix(computerContainer)

  resetState(playerState)
  resetState(computerState)

  turn = 'player'
  playerShipsLeft = 20
  computerShipsLeft = 20

  removeStyleState()
}

function finishedGame () {
  addStatus(playerShipsLeft === 0 ? 'Победил компьютер!' : 'Вы победили!')
  startBtn.textContent = 'Начать новую игру'

  startBtn.disabled = false
  finishBtn.disabled = true

  gameStart = false
  
}

function resetState(state) {
  state.ships = [4,3,3,2,2,2,1,1,1,1]
  state.shipsContainer = []
  state.currentShipSize = 4
  state.currentShipCells = []
  state.direction = null
}

computerField.addEventListener('click', (e) => {
  if (playerState.shipsContainer.length !== 10) return
  const row = +e.target.dataset.row
  const col = +e.target.dataset.col

  playerShoot(row, col)
})