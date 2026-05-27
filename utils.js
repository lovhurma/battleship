import { gameStatus, computerField, playerField } from "./dom.js"

export const HIT = 2
export const MISS = 3

export function paintShip(row, col) {
  const cell = document.querySelector(
    `.player-cell[data-row="${row}"][data-col="${col}"]`
  )

  if (cell) {
    cell.classList.add('ship')
  } 
}

export function removeStyleState() {
  computerField.querySelectorAll('.cell').forEach((cell) => {
    cell.classList.remove('ship', 'miss', 'hit')
  })
  playerField.querySelectorAll('.cell').forEach((cell) => {
    cell.classList.remove('ship', 'miss', 'hit')
  })
}

export function paintCellPlayer (row, col, state) {
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

export function paintCellComp (row, col, state) {
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

export function addStatus (text) {
  gameStatus.textContent = text
}