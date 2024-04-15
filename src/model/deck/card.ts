export type DeployHoplite = "DeployHoplite"
export type ManeuverLeft = "ManeuverLeft"
export type ManeuverRight = "ManeuverRight"
export type ManeuverForward = "ManeuverForward"
export type AssaultForward = "AssaultForward"
export type AssaultLeft = "AssaultLeft"
export type AssaultRight = "AssaultRight"
export type Charge = "Charge"
export type FlankLeft = "FlankLeft"
export type FlankRight = "FlankRight"
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
  | AssaultLeft
  | AssaultRight
  | AssaultForward
  | Charge
  | FlankLeft
  | FlankRight
  | MilitaryReforms
  | PoliticalReforms
  | Oracle

type StrategyCost = number
type TacticCost = number
type ResourceCost = number
type ResourceValue = number

type PlayCost = [StrategyCost, TacticCost, ResourceCost]
type AcquireCost = ResourceCost

export const all: Card[] = [
  "DeployHoplite",
  "ManeuverLeft",
  "ManeuverRight",
  "ManeuverForward",
  "AssaultLeft",
  "AssaultRight",
  "AssaultForward",
  "Charge",
  "FlankLeft",
  "FlankRight",
  "MilitaryReforms",
  "PoliticalReforms",
  "Oracle",
]

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
    case "AssaultForward":
      return "Assualt Forward"
    case "AssaultLeft":
      return "Assault Left"
    case "AssaultRight":
      return "Assault Right"
    case "Charge":
      return "Charge"
    case "FlankLeft":
      return "Flank Left"
    case "FlankRight":
      return "Flank Right"
    case "MilitaryReforms":
      return "Military Reforms"
    case "PoliticalReforms":
      return "Political Reforms"
    case "Oracle":
      return "Oracle"
  }
}

export const toCost = (card: Card): PlayCost => {
  switch (card) {
    case "DeployHoplite":
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return [1, 0, 0]
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
    case "AssaultLeft":
    case "AssaultRight":
    case "AssaultForward":
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
      return [0, 1, 0]
  }
}

export const toAcquireCost = (card: Card): AcquireCost => {
  switch (card) {
    case "DeployHoplite":
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
      return 0
    case "AssaultLeft":
    case "AssaultRight":
    case "AssaultForward":
      return 1
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
      return 2
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return 5
  }
}

export const toResourceValue = (card: Card): ResourceValue => {
  switch (card) {
    case "DeployHoplite":
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
      return 1
    case "AssaultLeft":
    case "AssaultRight":
    case "AssaultForward":
      return 1
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
      return 2
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return 3
  }
}
