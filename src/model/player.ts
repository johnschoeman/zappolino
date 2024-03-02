export type Player = "Black" | "White"

export const show = (player: Player): string => {
  switch (player) {
    case "Black":
      return "B"
    case "White":
      return "W"
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
