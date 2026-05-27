import { playerContainer, computerContainer, createMatrix, EMPTY, SHIP } from "./matrix.js";
import { computerField, startBtn, finishBtn} from "./dom.js"
import {paintCellComp, paintCellPlayer, removeStyleState, addStatus, HIT, MISS} from "./utils.js"

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
    turn = 'player'
    setTimeout(() => {
      addStatus('Ваш ход')
    }, 1000)
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
    turn = 'computer'
    addStatus('Ход компьютера')
    setTimeout(computerShoot, 5000)}
  }
  if (coordinate === EMPTY) {
    computerContainer[row][col] = MISS
    paintCellComp (row, col, MISS)
    turn = 'computer'
    addStatus('Ход компьютера')
    setTimeout(computerShoot, 5000)
  }
}

function startedGame () {
  finishBtn.disabled = false
  playerContainer.length = 0
  computerContainer.length = 0
  createMatrix(playerContainer)
  createMatrix(computerContainer)
  turn = 'player'
  playerShipsLeft = 20
  computerShipsLeft = 20
  removeStyleState()
}

function finishedGame (element) {
  addStatus(playerShipsLeft === 0 ? 'Победил компьютер!' : 'Вы победили!')
  startBtn.textContent = 'Начать новую игру'
  startBtn.disabled = false
  finishBtn.disabled = true
  
}

computerField.addEventListener('click', (e) => {
  const row = +e.target.dataset.row
  const col = +e.target.dataset.col

  playerShoot(row, col)
})