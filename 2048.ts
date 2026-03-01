export type Action = 'up' | 'right' | 'down' | 'left'

export type Tiles = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
]

export type Game = {
  readonly tiles: Tiles
  readonly score: number
  readonly won: boolean
  readonly play: boolean
}

function findEmptyTiles(tiles: Tiles): [number, number][] {
  return tiles.flatMap((row, x) => {
    return row.reduce<[number, number][]>(
      (acc, tile, y) => (tile === 0 ? [...acc, [x, y]] : acc),
      []
    )
  })
}

function randomNewTile(tiles: Tiles): Tiles { // uses 'findEmptyTiles' to add new ones.
  const emptyTiles = findEmptyTiles(tiles)
  if (emptyTiles.length > 0) {
    const randomEmptyTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]
    tiles[randomEmptyTile[0]][randomEmptyTile[1]] = Math.random() >= 0.9 ? 4 : 2
  }
  return tiles
}

export function newGameFactory() {
  const game: Game = {
    tiles: randomNewTile(
      randomNewTile([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ])
    ),
    score: 0,
    won: false,
    play: true
  };

  return Object.freeze(game);
}

function compress(row: number[]): number[] {
  const rowWithoutZeros = row.filter((val) => val !== 0)
  return [...rowWithoutZeros, ...Array(row.length - rowWithoutZeros.length).fill(0)]
}

function transpose(tiles: Tiles): Tiles {
  return tiles[0].map((_tile, col) => tiles.map((row) => row[col])) as Tiles
}

function merge(val: number, i: number, row: number[]): [number, number] {
  if (val > 0 && val === row[i + 1]) {
    row[i + 1] = 0
    return [val * 2, val * 2]
  }
  return [val, 0]
}

function shiftRowLeft(row: number[]): { row: number[]; scoreIncrement: number } {
  const uncompressed = compress(row)
    .map(merge)
    .reduce<{ row: number[]; scoreIncrement: number }>(
      ({ row, scoreIncrement }, [val, score]) => ({
        row: [...row, val],
        scoreIncrement: score + scoreIncrement
      }),
      { row: [], scoreIncrement: 0 }
    )
  uncompressed.row = compress(uncompressed.row)
  return uncompressed
}

function collectRowsAndScore(rowsWithScores: { row: number[]; scoreIncrement: number }[]): {
  tiles: Tiles
  score: number
} {
  return rowsWithScores.reduce<{ tiles: number[][]; score: number }>(
    ({ tiles, score }, { row, scoreIncrement }) => ({
      tiles: [...tiles, row],
      score: score + scoreIncrement
    }),
    { tiles: [], score: 0 }
  ) as { tiles: Tiles; score: number }
}

function transposeComp({ tiles, score }: { tiles: Tiles; score: number }) {
  return {
    score,
    tiles: transpose(tiles)
  }
}

function shiftLeft(tiles: Tiles): { tiles: Tiles; score: number } {
  // Uses collectRowAndScore to gather the score, and shitRowLeft to comply with the left movement
  return collectRowsAndScore(tiles.map((row) => shiftRowLeft(row)))
}

function shiftRight(tiles: Tiles): { tiles: Tiles; score: number } {
  return collectRowsAndScore(
    tiles.map((oldRow) => {
      const { row, scoreIncrement } = shiftRowLeft(oldRow.reverse())
      return { row: row.reverse(), scoreIncrement }
    })
  )
}

function shiftUp(tiles: Tiles): { tiles: Tiles; score: number } {
  return transposeComp(shiftLeft(transpose(tiles)))
}

function shiftDown(tiles: Tiles): { tiles: Tiles; score: number } {
  return transposeComp(shiftRight(transpose(tiles)))
}

function shift(tiles: Tiles, action: Action): { tiles: Tiles; score: number } {
  switch (action) {
    case 'down':
      return shiftDown(tiles)
    case 'left':
      return shiftLeft(tiles)
    case 'right':
      return shiftRight(tiles)
    case 'up':
      return shiftUp(tiles)
  }
}

function rowMergeableTiles(tiles: Tiles): boolean {
  return tiles.some((row) => row.some((tile, i) => tile === row[i + 1]))
}

export function nextGame(game: Game, action: Action): Game {
  if (game.play) {
    const { tiles, score } = shift(game.tiles, action)
    return Object.freeze({
      score: game.score + score,
      tiles: randomNewTile(tiles),
      won: tiles.reduce((acc, row) => acc || row.some((tile) => tile === 2048), false),
      play:
        findEmptyTiles(tiles).length > 0 ||
        rowMergeableTiles(tiles) ||
        rowMergeableTiles(transpose(tiles))
    })
  }
  return game
}
