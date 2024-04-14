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

export const toggle = (player: Player): Player => {
  switch (player) {
    case "Black":
      return "White"
    case "White":
      return "Black"
  }
}
