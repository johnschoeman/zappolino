import { createSignal, JSX } from "solid-js"
import { pipe, ReadonlyArray } from "effect"

import { Board, Game } from "@app/model"

const [game, setGame] = createSignal<Game.Game>(Game.initial)

const BoardView = (): JSX.Element => {
  const handleOnClickProgress = (): void => {
    pipe(game(), Game.progress, setGame)
  }

  return (
    <div class="p-2 space-y-4">
      <div class="flex flex-col">
        {pipe(
          game().board,
          ReadonlyArray.map((row, idx) => <RowView row={row} rowIdx={idx} />),
        )}
      </div>

      <div>Current player: {game().currentPlayer}</div>

      <button
        class="px-4 py-2 bg-green-300 rounded"
        type="button"
        onClick={handleOnClickProgress}
      >
        Progress
      </button>
    </div>
  )
}

type RowViewProps = {
  row: Board.Row<Board.Cell>
  rowIdx: number
}
const RowView = ({ row, rowIdx }: RowViewProps): JSX.Element => {
  return (
    <div class="flex flex-row">
      {pipe(
        row,
        ReadonlyArray.map((cell, idx) => (
          <CellView cell={cell} rowIdx={rowIdx} colIdx={idx} />
        )),
      )}
    </div>
  )
}

type CellViewProps = {
  cell: Board.Cell
  rowIdx: number
  colIdx: number
}
const CellView = ({ cell, rowIdx, colIdx }: CellViewProps): JSX.Element => {
  const handleOnClickCell = (): void => {
    pipe(game(), Game.addPiece(rowIdx)(colIdx), setGame)
  }
  return (
    <div
      class="border w-32 h-32 p-4 flex items-center justify-center"
      onClick={handleOnClickCell}
    >
      {pipe(cell, Board.showCell)}
    </div>
  )
}

export default BoardView
