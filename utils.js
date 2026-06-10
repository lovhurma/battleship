import { gameStatus, computerField, playerField } from "./dom.js"

export const HIT = 2
export const MISS = 3

export function changeOrientation (element, orientation) {
  if (!element) return
  if (orientation === 'horizontal') {
    element.classList.remove('vertical')
    element.dataset.orientation = 'horizontal'
  } else {
    element.classList.add('vertical')
    element.dataset.orientation = 'vertical'
  }
}

export function paintShip(row, col) {
  const cell = document.querySelector(
    `.player-cell[data-row="${row}"][data-col="${col}"]`
  )

  if (cell) {
    cell.classList.add('ship-cell')
  } 
}

export function paintAllowed (ship) {
  ship.forEach(([row,col]) => {
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
  if (cell) {
    cell.classList.add('shadow-allowed')
  }})
}

export function paintForbidden (ship) {
  ship.forEach(([row,col]) => {
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
  if (cell) {
    cell.classList.add('shadow-forbidden')
  }})
}

export function removeStyleState() {
  computerField.querySelectorAll('.cell').forEach((cell) => {
    cell.classList.remove('ship-cell', 'miss', 'hit')
  })
  playerField.querySelectorAll('.cell').forEach((cell) => {
    cell.classList.remove('ship-cell', 'miss', 'hit')
  })
}

export function paintCellPlayer (row, col, state) {
  const cell = document.querySelector(
    `.player-cell[data-row="${row}"][data-col="${col}"]`
  )

  if (state === HIT) {
    cell.classList.remove('ship-cell')
    cell.classList.add('hit') 
  }
  if (state === MISS) {
    cell.classList.add('miss') 
  }
}

export function paintCellComp (row, col, state) {
  const cell = document.querySelector(
    `.computer-cell[data-row="${row}"][data-col="${col}"]`
  )

  if (state === HIT) {
    cell.classList.remove('ship-cell')
    cell.classList.add('hit') 
  }
  if (state === MISS) {
    cell.classList.add('miss') 
  }
}

export function addStatus (text) {
  gameStatus.textContent = text
}