import { playerField, computerField, wordsContainer, numbersContainer } from "./dom.js"

const WORLDS = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function createCell(element) {
  for (let i = 0; i < 100; i++) {
    let div = document.createElement('div')

    div.dataset.row = Math.floor(i / 10)
    div.dataset.col = i % 10

    div.classList.add('cell')

    if (element === computerField) {
      div.classList.add('computer-cell')
    }

    if (element === playerField) {
      div.classList.add('player-cell')
    }

    element.append(div)
  }
}

createCell(playerField)
createCell(computerField)

function createFieldLabels(element, label) {
  for (let i = 0; i < 10; i++) {
    let divForPlayer = document.createElement('div')
    let divForComputer = document.createElement('div')

    divForPlayer.textContent = label[i]
    divForComputer.textContent = label[i]

    element[0].append(divForPlayer)
    element[1].append(divForComputer)
  }
}

createFieldLabels(wordsContainer, WORLDS)
createFieldLabels(numbersContainer, NUMBERS)