import { playerContainer, computerContainer, EMPTY, SHIP } from "./matrix.js";
import { computerField} from "./dom.js"

const HIT = 2
const MISS = 3

let turn = 'player'

function paintCellComp (row, col, state) {
  const cell = document.querySelector(
    `.computer-cell[data-row="${row}"][data-col="${col}"]`
  )

  if (state === HIT) {
    cell.classList.remove('ship')//зеленый
    cell.classList.add('hit') //красный
  }
  if (state === MISS) {
    cell.classList.add('miss') //желтый
  }
}

function paintCellPlayer (row, col, state) {
  const cell = document.querySelector(
    `.player-cell[data-row="${row}"][data-col="${col}"]`
  )

  if (state === HIT) {
    cell.classList.remove('ship')//зеленый
    cell.classList.add('hit') //красный
  }
  if (state === MISS) {
    cell.classList.add('miss') //желтый
  }
}

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
    paintCellPlayer (row, col, HIT)
    turn = 'player'
  }
  if (coordinate === EMPTY) {
    playerContainer[row][col] = MISS
    paintCellPlayer (row, col, MISS)
    turn = 'player'
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
    paintCellComp (row, col, HIT)
    turn = 'computer'
    setTimeout(computerShoot, 5000)
  }
  if (coordinate === EMPTY) {
    computerContainer[row][col] = MISS
    paintCellComp (row, col, MISS)
    turn = 'computer'
    setTimeout(computerShoot, 5000)
  }
}

computerField.addEventListener('click', (e) => {
  const row = +e.target.dataset.row
  const col = +e.target.dataset.col

  playerShoot(row, col)
})