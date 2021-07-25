import { buildBoard, markTile, revealTile, checkWin, checkLoss, TILE_STATUSES } from "./mindweeper.js"



const stopProp = (e) => {
  e.stopImmediatePropagation()
}

const BOARD_SIZE = 10;
const NUM_MINES = 10

const boardElem = document.querySelector('.board')
const mineCount = document.querySelector(".mine-count")
const resetBtn = document.querySelector(".reset")
const msgText = document.querySelector(".subtext")

const reset = () => {
  boardElem.removeEventListener('click', stopProp, {capture: true})
  boardElem.removeEventListener('contextmenu', stopProp, {capture: true})
  boardElem.innerHTML=""
  msgText.innerHTML=""
  startGame()
}

const startGame = () => {
  resetBtn.textContent = 'Reset'
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
  const board = buildBoard(BOARD_SIZE, NUM_MINES)
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

}

resetBtn.addEventListener('click', () => {
  reset()
})  
