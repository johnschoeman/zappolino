import { createSignal, JSX } from "solid-js"

import { Board } from "@app/model"

const BoardView = (): JSX.Element => {
  const [board, _setBoard] = createSignal<Board.Board>(Board.empty)

  return <div>{Board.show(board())}</div>
}

export default BoardView
