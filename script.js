import { buildBoard, markTile, revealTile, checkWin, checkLoss, TILE_STATUSES } from "./mindweeper.js"

const checkGameStatus = () => {
  const win = checkWin(board);
  const loss = checkLoss(board);

  if (win || loss) {
    boardElem.addEventListener('click', stopProp, {capture: true})
    boardElem.addEventListener('contextmenu', stopProp, {capture: true})
  }
  if (win) msgText.innerHTML = "You Win :)"
  if (loss) {
    board.forEach(row => row.forEach(tile => {
      if(tile.status === TILE_STATUSES.MARKED) markTile(tile)
      if(tile.armed) revealTile(board, tile)
      }))
    msgText.innerHTML = "You Lose :("
  }
}

const stopProp = (e) => {
  e.stopImmediatePropagation()
}

const BOARD_SIZE = 10;
const NUM_MINES = 10

const board = buildBoard(BOARD_SIZE, NUM_MINES)
const boardElem = document.querySelector('.board')
const mineCount = document.querySelector(".mine-count")
const resetBtn = document.querySelector(".reset")
const msgText = document.querySelector(".subtext")

board.forEach(row => row.forEach(tile => {
  boardElem.append(tile.element)
  tile.element.addEventListener('click', () => {
    revealTile(board, tile)
    checkGameStatus()
  })
  tile.element.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    markTile(tile)
  })
}))

boardElem.style.setProperty("--size", BOARD_SIZE)
mineCount.textContent = NUM_MINES

resetBtn.addEventListener('click', () => {
  window.location = '/'
})
