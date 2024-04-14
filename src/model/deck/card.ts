export type Place = "Place"
export type MoveLeft = "MoveLeft"
export type MoveRight = "MoveRight"
export type MoveForward = "MoveForward"
export type Charge = "Charge"
export type Flank = "Flank"
export type Retreat = "Retreat"
export type MilitaryReforms = "MilitaryReforms"
export type PoliticalReforms = "PoliticalReforms"
export type Oracle = "Oracle"

export type Card =
  | Place
  | MoveLeft
  | MoveRight
  | MoveForward
  | Charge
  | Flank
  | Retreat
  | MilitaryReforms
  | PoliticalReforms
  | Oracle

type StrategyCost = number
type TacticCost = number

export const toTitle = (card: Card): string => {
  switch (card) {
    case "Place":
      return "Place Piece"
    case "MoveLeft":
      return "Move Left"
    case "MoveRight":
      return "Move Right"
    case "MoveForward":
      return "Move Forward"
    case "Charge":
      return "Charge"
    case "Flank":
      return "Flank"
    case "Retreat":
      return "Retreat"
    case "MilitaryReforms":
      return "Military Reforms"
    case "PoliticalReforms":
      return "Political Reforms"
    case "Oracle":
      return "Oracle"
  }
}

export const toCost = (card: Card): [StrategyCost, TacticCost] => {
  switch (card) {
    case "Place":
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return [1, 0]
    case "MoveLeft":
    case "MoveRight":
    case "Charge":
    case "MoveForward":
    case "Flank":
    case "Retreat":
      return [0, 1]
  }
}
