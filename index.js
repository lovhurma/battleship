// Секция игрока
const player = document.querySelector('.player')

// Контейнер для поля игрока
const playerField = player.querySelector('.player__field')

// Секция компьютера
const computer = document.querySelector('.computer')

// Контейнер для поля компьютера
const computerField = computer.querySelector('.computer__field')

// Контейнеры для названия полей
const wordsContainer = document.querySelectorAll('.words')
const numbersContainer = document.querySelectorAll('.numbers')

// ____________________Создание полей_________________________

const WORLDS = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К']
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const playerContainer = []
const computerContainer = []

function createCell(element) {
  for (let i = 0; i < 100; i++) {
    let div = document.createElement('div')

    div.dataset.row = Math.floor(i / 10)
    div.dataset.col = i % 10

    div.classList.add('cell')

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

// ____________________Создание логики_________________________

// Функция создания матрицы
function createMatrix(player) {
  for (let i = 0; i < 100; i++) {
    player[i] = []

    for (let j = 0; j < 100; j++) {
      player[i][j] = 0
    }
  }
}

createMatrix(playerContainer)
createMatrix(computerContainer)

// Для ручного заполнения полей игрока
playerField.addEventListener('click', (e) => {
  const row = e.target.dataset.row
  const col = e.target.dataset.col

  console.log(`Строка ${row}, колонка ${col}`)
})