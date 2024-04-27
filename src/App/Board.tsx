import { JSX } from "solid-js"
import cn from "classnames"
import { Array, Match, pipe } from "effect"

import { Board, Cell, GameAction, Player, Position } from "@app/model"
import { GameState } from "@app/state"

const BoardView = (): JSX.Element => {
  return (
    <div data-testid="game-board" class="">
      <div class="flex flex-col">
        {pipe(
          GameState.game().board,
          Array.map((row, idx) => <RowView row={row} rowIdx={idx} />),
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
  const isWhiteHomeRow = Player.homeRowIdx("White") === rowIdx
  const isBlackHomeRow = Player.homeRowIdx("Black") === rowIdx

  const style = cn("flex flex-row", {
    "border-t-2 border-sparta": isWhiteHomeRow,
    "border-b-2 border-athens": isBlackHomeRow,
  })

  return (
    <div class={style}>
      {pipe(
        row,
        Array.map((cell, idx) => (
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
      GameAction.selectCell({ rowIdx, colIdx }),
      GameState.setGame,
    )
  }
  const testId = pipe(
    Position.toRankFile({ rowIdx, colIdx }),
    Position.showRankFile,
  )

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
