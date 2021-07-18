export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked"
}

export const checkWin = (board) => {
  return board.every(row => {
    return row.every(tile => {
      return (
        tile.status === TILE_STATUSES.NUMBER ||
        tile.armed && tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED
      )
    })
  })
}

export const checkLoss = (board) => {
  return board.some(row => row.some(tile => {
    return tile.status === TILE_STATUSES.MINE
  }))
}

const armTileCheck = (boardSize) => {
  return !!Math.floor(Math.random() * boardSize)
}

export const buildBoard = (boardSize, numMines) => {
  const board = []
  let remainingMines = numMines;
  for (let x = 0; x < boardSize; x++){
    const row = []
    for (let y = 0; y < boardSize; y++){
      let armed = false;
      if (remainingMines) {
        if (!armTileCheck(boardSize - (x * y))){
          console.log("Arming...")
          armed = true;
          remainingMines--;
        }
      }
      const element = document.createElement("div")
      element.dataset.status = TILE_STATUSES.HIDDEN;
      const tile = {
        x, 
        y, 
        armed, 
        element,
        get status() {
          return this.element.dataset.status
        },
        set status(newStatus) {
          this.element.dataset.status = newStatus
        }
      }
      row.push(tile)
    }
    board.push(row)
  }

  return board
}

export const markTile = (tile) => {
  if (tile.status === TILE_STATUSES.NUMBER || tile.status === TILE_STATUSES.MINE) return
  tile.status = tile.status === TILE_STATUSES.HIDDEN ? TILE_STATUSES.MARKED : TILE_STATUSES.HIDDEN
}

const getAdjacentTiles = (board, {x, y}) => {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++){
    for (let yOffset = -1; yOffset <= 1; yOffset++){
      const tile = board[x + xOffset]?.[y + yOffset]
      tile && tiles.push(tile)
    }
  }

  return tiles;
}

export const revealTile = (board, tile) => {
  if (tile.status !== TILE_STATUSES.HIDDEN) return
  if (tile.armed) {tile.status = TILE_STATUSES.MINE; return}

  tile.status = TILE_STATUSES.NUMBER
  const neighborTiles = getAdjacentTiles(board, tile)
  const neighborMines = neighborTiles.filter(tile => tile.armed)
  if (neighborMines.length) {
    tile.element.textContent = neighborMines.length
  } else {
    neighborTiles.forEach(revealTile.bind(null, board))
  }
}