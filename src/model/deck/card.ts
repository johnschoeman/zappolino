export type ManeuverLeft = "ManeuverLeft"
export type ManeuverRight = "ManeuverRight"
export type ManeuverForward = "ManeuverForward"
export type AssaultForward = "AssaultForward"
export type AssaultLeft = "AssaultLeft"
export type AssaultRight = "AssaultRight"
export type Charge = "Charge"
export type FlankLeft = "FlankLeft"
export type FlankRight = "FlankRight"
export type DeployHoplite = "DeployHoplite"
export type Polis = "Polis"
export type MilitaryReforms = "MilitaryReforms"
export type PoliticalReforms = "PoliticalReforms"
export type Oracle = "Oracle"

export type Card =
  | ManeuverLeft
  | ManeuverRight
  | ManeuverForward
  | AssaultLeft
  | AssaultRight
  | AssaultForward
  | Charge
  | FlankLeft
  | FlankRight
  | DeployHoplite
  | Polis
  | MilitaryReforms
  | PoliticalReforms
  | Oracle

type StrategyCost = number
type TacticCost = number
type ResourceCost = number
type PlayCost = [StrategyCost, TacticCost, ResourceCost]

type PlacementValue = number
type StrategyValue = number
type TacticValue = number
type ResourceValue = number
type DrawValue = number
export type PlayValue = [
  PlacementValue,
  StrategyValue,
  TacticValue,
  ResourceValue,
  DrawValue,
]

type Kind = "Tactic" | "Strategy"

const allTactic: Card[] = [
  "ManeuverLeft",
  "ManeuverRight",
  "ManeuverForward",
  "AssaultLeft",
  "AssaultRight",
  "AssaultForward",
  "Charge",
  "FlankLeft",
  "FlankRight",
]

export const allStrategy: Card[] = [
  "DeployHoplite",
  "Polis",
  "MilitaryReforms",
  "PoliticalReforms",
  "Oracle",
]

export const all: Card[] = [...allStrategy, ...allTactic]

export const show = (card: Card): string => {
  switch (card) {
    case "ManeuverLeft":
      return "maneuver-left"
    case "ManeuverRight":
      return "maneuver-right"
    case "ManeuverForward":
      return "maneuver-forward"
    case "AssaultForward":
      return "assualt-forward"
    case "AssaultLeft":
      return "assault-left"
    case "AssaultRight":
      return "assault-right"
    case "Charge":
      return "charge"
    case "FlankLeft":
      return "flank-left"
    case "FlankRight":
      return "flank-right"
    case "DeployHoplite":
      return "deploy-hoplite"
    case "Polis":
      return "polis"
    case "MilitaryReforms":
      return "military-reforms"
    case "PoliticalReforms":
      return "political-reforms"
    case "Oracle":
      return "oracle"
  }
}

export const isTactic = (card: Card): boolean => {
  return toKind(card) === "Tactic"
}

export const isStrategy = (card: Card): boolean => {
  return toKind(card) === "Strategy"
}

export const toKind = (card: Card): Kind => {
  switch (card) {
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
    case "AssaultForward":
    case "AssaultLeft":
    case "AssaultRight":
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
      return "Tactic"
    case "DeployHoplite":
    case "Polis":
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return "Strategy"
  }
}

export const toTitle = (card: Card): string => {
  switch (card) {
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
    case "DeployHoplite":
      return "Deploy Hoplite"
    case "Polis":
      return "Polis"
    case "MilitaryReforms":
      return "Military Reforms"
    case "PoliticalReforms":
      return "Political Reforms"
    case "Oracle":
      return "Oracle"
  }
}

export const toFlavorText = (card: Card): string => {
  switch (card) {
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
    case "AssaultForward":
    case "AssaultLeft":
    case "AssaultRight":
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
    case "DeployHoplite":
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return ""
    case "Polis":
      return "A political concept which encompasses the entire territory and citizen body of a city-state"
  }
}

export const toDescription = (card: Card): string => {
  switch (card) {
    case "ManeuverLeft":
      return "Maneuver a hoplite to the left"
    case "ManeuverRight":
      return "Maneuver a hoplite to the right"
    case "ManeuverForward":
      return "Maneuver maneuver a hoplite forward"
    case "AssaultForward":
      return "Take a piece directly in front of a hoplite"
    case "AssaultLeft":
      return "Take a piece directly to the left of a hoplite"
    case "AssaultRight":
      return "Take a piece directly to the right of a hoplite"
    case "Charge":
      return "Move a hoplite forward, taking any opponent piece"
    case "FlankLeft":
      return "Move a hoplite left, taking any opponent piece"
    case "FlankRight":
      return "Move a hoplite right, taking any opponent piece"
    case "DeployHoplite":
    case "Polis":
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return ""
  }
}

// [StrategyCost, TacticCost, ResourceCost]
export const toPlayCost = (card: Card): PlayCost => {
  switch (card) {
    case "DeployHoplite":
    case "Polis":
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

// [Hoplite, Strategy, Tactics, Resources, Draw]
export const toPlayValue = (card: Card): PlayValue => {
  switch (card) {
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
    case "AssaultLeft":
    case "AssaultRight":
    case "AssaultForward":
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
      return [0, 0, 0, 0, 0]
    case "DeployHoplite":
      return [1, 0, 0, 0, 0]
    case "Polis":
      return [0, 2, 0, 0, 1]
    case "MilitaryReforms":
      return [0, 0, 3, 0, 0]
    case "PoliticalReforms":
      return [0, 2, 0, 0, 0]
    case "Oracle":
      return [0, 1, 2, 0, 1]
  }
}

export const toResourceCost = (card: Card): ResourceCost => {
  switch (card) {
    case "DeployHoplite":
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
      return 1
    case "AssaultLeft":
    case "AssaultRight":
    case "AssaultForward":
    case "Polis":
      return 2
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
      return 3
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
    case "Polis":
      return 2
    case "MilitaryReforms":
    case "PoliticalReforms":
    case "Oracle":
      return 3
  }
}
