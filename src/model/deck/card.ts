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

// -- Tactics
// Sortie
// Push         - push the whole column forward
// Withdraw
// Rush
// Sally
// Strike
// Raid
// ???          - all units maneuver forward 1
// ???          - all units assault forward 1
// ???          - all units charge forward 1
//
// -- Strategy
// Forage
// War Party
// 12 Labors
// Greek Myth
// Martial Prowess
// Staggered March
// Military Logistics
// Hellenic Craftsmanship
//
//
// -- Places
// Temple of Zeus
// Temple of Poseidon
// Aegean Sea
//
// -- Famous Units
// Scared Band of Thebes
//
//
// Dellian League
// Pelopisian League
//
//
// -- Navy
// Trireme
//
//
// -- Unit Types
// Hoplite -> heavy infantry, less flexible
// Pelitst -> harassing troops, more flexible more nimble
//   - moves 2x, not counted in depth calculation
// Calvary
// Pisloi - Naked or stripped forces, cared for horses, equipment
// Helots - slaves
//
// -- Kit
// Swords, Spears, Javelins, Bows and Arrows
// Sling-propelled countersiege, Torsional Machine Catapult, Bow-Driven Catapults
//
// Panoply - individual soldier's equipment
//
// Helmets
// Chorintian (ancient, not classical)
// Phrygian / Thracian
// Chalcidean
// pilos (flet)
// Boeotian
//
// Linothorax
// Bronze Breastplate
// Greaves
//
// Hoplon (shield)
// Aspis (shield) -
// Argive grip    -
// Pelta - small shield used with Sarissa
//
// Dory Hus - spear makers
// Dory         - ???
// Spearhead    - ???
// Sauroter "lizard-killer" - ??? Styrax
// ???          - +1 depth when defending, next turn
// Sarissa Pike - +1 depth at end of turn
// ???          - remove hoplite from field, +1 hoplite
//
// Cornel Wood
//
// Kopis (hacking sword) -
// Spartan Kopis - "It is long enough to reach your heart"
// Xiphos (short sword)  -
//
// -- Cards
//
// Hoplite               - +1 hoplite
// Organized Deploy      - +1 strategy +1 hoplite
// Military Mobilization - +1 strategy +2 hoplite
// Auxiliary Troops      - +2 hoplite
// Phalanx               - +3 hoplite
//
// City State            - +1 draw +2 strategy
// Wartime Preparations  - +1 draw +1 strategy +1 tactic +1 resources
// Hellenic Craftsman    - +3 draw
// Scouting Party        - +1 draw +3 tactic
//
// Democratic Faction    - +3 strategy
//
// The Senate            - +2 draw +2 strategy +1 tactic
// The Five Ephors       - +2 draw +1 strategy +3 tactic
//
// Battle Plans          - +1 tactic
// Military Training     - +2 tactic
// Military Logistics    - +3 tactic
// Thracian Tactics      - +4 tactic
// Oligarchic Faction    - +5 tactic

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
export type PlayValue = [
  PlacementValue,
  StrategyValue,
  TacticValue,
  ResourceValue,
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
      return "city-state"
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
      return "City State"
    case "MilitaryReforms":
      return "Military Reforms"
    case "PoliticalReforms":
      return "Political Reforms"
    case "Oracle":
      return "Oracle"
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
      return "Deploy a hoplite to the field on your home row"
    case "Polis":
      return ""
    case "MilitaryReforms":
      return ""
    case "PoliticalReforms":
      return ""
    case "Oracle":
      return ""
  }
}

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
      return [0, 0, 0, 0]
    case "DeployHoplite":
      return [1, 0, 0, 0]
    case "Polis":
      return [0, 2, 0, 0]
    case "MilitaryReforms":
      return [0, 0, 3, 0]
    case "PoliticalReforms":
      return [0, 2, 0, 0]
    case "Oracle":
      return [0, 1, 2, 0]
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
