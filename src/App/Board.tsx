import { JSX } from "solid-js"
import cn from "classnames"
import { pipe, ReadonlyArray, Match } from "effect"

import { Board, Cell, Game, Position } from "@app/model"
import { GameState } from "@app/state"

const BoardView = (): JSX.Element => {
  return (
    <div data-testid="game-board" class="">
      <div class="flex flex-col">
        {pipe(
          GameState.game().board,
          ReadonlyArray.map((row, idx) => <RowView row={row} rowIdx={idx} />),
        )}
      </div>
    </div>
  )
}

type RowViewProps = {
  row: Board.Row<Cell.Cell>
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
  cell: Cell.Cell
  rowIdx: number
  colIdx: number
}
const CellView = ({ cell, rowIdx, colIdx }: CellViewProps): JSX.Element => {
  const handleOnClickCell = (): void => {
    pipe(
      GameState.game(),
      Game.selectCell({ rowIdx, colIdx }),
      GameState.setGame,
    )
  }
  const testId = Position.toRankFile({ rowIdx, colIdx })

  return (
    <div
      class="border w-24 h-24 p-4 flex items-center justify-center"
      data-testid={testId}
      data-cell={Cell.show(cell)}
      onClick={handleOnClickCell}
    >
      {pipe(
        cell,
        Cell.match.pipe(
          Match.tag("Piece", piece => <PieceView piece={piece} />),
          Match.tag("Empty", () => <div>-</div>),
          Match.exhaustive,
        ),
      )}
    </div>
  )
}

type PieceViewProps = {
  piece: Cell.Piece
}
const PieceView = ({ piece }: PieceViewProps): JSX.Element => {
  const style = cn("border-2 border-black w-8 h-8", {
    "bg-white": piece.player === "White",
    "bg-black": piece.player === "Black",
  })

  return <div class={style}></div>
}

export default BoardView
