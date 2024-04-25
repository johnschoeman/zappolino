import { Board } from "./board"
import * as Position from "./position"

export type White = "White"
export type Black = "Black"
export type Player = Black | White

export const show = (player: Player): string => {
  switch (player) {
    case "Black":
      return "Black"
    case "White":
      return "White"
  }
}

export const toLabel = (player: Player): string => {
  switch (player) {
    case "Black":
      return "Athens"
    case "White":
      return "Sparta"
  }
}

export const toggle = (player: Player): Player => {
  switch (player) {
    case "Black":
      return "White"
    case "White":
      return "Black"
  }
}

export const homeRank = (player: Player): Position.Rank => {
  return Position.rowToRank(homeRowIdx(player))
}

export const homeRowIdx = (player: Player): number => {
  switch (player) {
    case "Black":
      return 0
    case "White":
      return Board.BOARD_ROWS - 1
  }
}
