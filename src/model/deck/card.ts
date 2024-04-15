export type DeployHoplite = "DeployHoplite"
export type ManeuverLeft = "ManeuverLeft"
export type ManeuverRight = "ManeuverRight"
export type ManeuverForward = "ManeuverForward"
export type Charge = "Charge"
export type Flank = "Flank"
export type Retreat = "Retreat"
export type MilitaryReforms = "MilitaryReforms"
export type PoliticalReforms = "PoliticalReforms"
export type Oracle = "Oracle"

// Sortie
// Push
// Withdraw
// Rush
// Sally
// Strike
// Raid

export type Card =
  | DeployHoplite
  | ManeuverLeft
  | ManeuverRight
  | ManeuverForward
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
    case "DeployHoplite":
      return "Deploy Hoplite"
    case "ManeuverLeft":
      return "Maneuver Left"
    case "ManeuverRight":
      return "Maneuver Right"
    case "ManeuverForward":
      return "Maneuver Forward"
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
    case "DeployHoplite":
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return [1, 0]
    case "ManeuverLeft":
    case "ManeuverRight":
    case "Charge":
    case "ManeuverForward":
    case "Flank":
    case "Retreat":
      return [0, 1]
  }
}
