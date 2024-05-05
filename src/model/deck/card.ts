import * as PointsPool from "../pointsPool"

// ---- Tactic Cards

export type ManeuverLeft = "ManeuverLeft"
export type ManeuverRight = "ManeuverRight"
export type ManeuverForward = "ManeuverForward"

export type AssaultForward = "AssaultForward"
export type AssaultLeft = "AssaultLeft"
export type AssaultRight = "AssaultRight"

export type Charge = "Charge"
export type FlankLeft = "FlankLeft"
export type FlankRight = "FlankRight"

// ---- Strategy Cards

export type Hoplite = "Hoplite"
export type AuxiliaryTroops = "AuxiliaryTroops"
export type Phalanx = "Phalanx"

export type OrganizedDeploy = "OrganizedDeploy"
export type MilitaryMobilization = "MilitaryMobilization"

export type Polis = "Polis"
export type Koinas = "Koinas"

export type HellenicCraftsmen = "HellenicCraftsmen"

export type Forage = "Forage"
export type Psiloi = "Psiloi"

export type AgeanSea = "AgeanSea"
export type IonianSea = "IonianSea"
export type Hellespont = "Hellespont"

export type TempleOfZeus = "TempleOfZeus"
export type TempleOfAthena = "TempleOfAthena"
export type TempleOfPoseidon = "TempleOfPoseidon"
export type OracleOfDelphi = "OracleOfDelphi"

export type PoliticalReforms = "PoliticalReforms"
export type DemocraticFaction = "DemocraticFaction"

export type TheSenate = "TheSenate"
export type TheFiveEphors = "TheFiveEphors"
export type TheTenStrategoi = "TheTenStrategoi"

export type Provisions = "Provisions"
export type SupplyCache = "SupplyCache"
export type PersianSupport = "PersianSupport"

export type MilitaryTraining = "MilitaryTraining"
export type MilitaryLogistics = "MilitaryLogistics"
export type MilitaryReforms = "MilitaryReforms"
export type ThraticanTactics = "ThraticanTactics"
export type OligarchicFaction = "OligarchicFaction"

export type VillageGranary = "VillageGranary"
export type WarSpoils = "WarSpoils"

export type TacticCard =
  | ManeuverLeft
  | ManeuverRight
  | ManeuverForward
  | AssaultLeft
  | AssaultRight
  | AssaultForward
  | Charge
  | FlankLeft
  | FlankRight

export type StrategyCard =
  | Hoplite
  | AuxiliaryTroops
  | Phalanx
  | OrganizedDeploy
  | MilitaryMobilization
  | Polis
  | Koinas
  | HellenicCraftsmen
  | TempleOfZeus
  | TempleOfAthena
  | TempleOfPoseidon
  | OracleOfDelphi
  | PoliticalReforms
  | DemocraticFaction
  | AgeanSea
  | IonianSea
  | Hellespont
  | Forage
  | Psiloi
  | TheSenate
  | TheFiveEphors
  | TheTenStrategoi
  | Provisions
  | SupplyCache
  | PersianSupport
  | MilitaryTraining
  | MilitaryLogistics
  | MilitaryReforms
  | ThraticanTactics
  | OligarchicFaction
  | VillageGranary
  | WarSpoils

export type Card = TacticCard | StrategyCard

type StrategyCost = number
type TacticCost = number
type ResourceCost = number
type PlayCost = [StrategyCost, TacticCost, ResourceCost]

export type PlayValue = PointsPool.PointsPool

type Kind = "Tactic" | "Strategy"

const allTactic: TacticCard[] = [
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

export const allStrategy: StrategyCard[] = [
  "Hoplite",
  "AuxiliaryTroops",
  "Phalanx",
  "OrganizedDeploy",
  "MilitaryMobilization",
  "Polis",
  "Koinas",
  "HellenicCraftsmen",
  "TempleOfZeus",
  "TempleOfAthena",
  "TempleOfPoseidon",
  "OracleOfDelphi",
  "MilitaryReforms",
  "PoliticalReforms",
  "AgeanSea",
  "IonianSea",
  "Hellespont",
  "Forage",
  "Psiloi",
  "TheSenate",
  "TheFiveEphors",
  "TheTenStrategoi",
  "Provisions",
  "SupplyCache",
  "PersianSupport",
  "MilitaryTraining",
  "MilitaryLogistics",
  "MilitaryReforms",
  "ThraticanTactics",
  "OligarchicFaction",
  "VillageGranary",
  "WarSpoils",
]

export const all: Card[] = [...allTactic, ...allStrategy]

export const isTactic = (card: Card): card is TacticCard => {
  return toKind(card) === "Tactic"
}

export const isStrategy = (card: Card): card is StrategyCard => {
  return toKind(card) === "Strategy"
}

export const show = (card: Card): string => {
  if (isTactic(card)) {
    return showTactic(card)
  }
  if (isStrategy(card)) {
    return showStrategy(card)
  }
  return ""
}

export const showTactic = (card: TacticCard): string => {
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
  }
}

export const showStrategy = (card: StrategyCard): string => {
  switch (card) {
    case "Hoplite":
      return "deploy-hoplite"
    case "AuxiliaryTroops":
      return "auxiliary-troops"
    case "Phalanx":
      return "phalanx"
    case "OrganizedDeploy":
      return "orgainzed-deploy"
    case "MilitaryMobilization":
      return "miliatry-mobilization"
    case "Polis":
      return "polis"
    case "Koinas":
      return "koinas"
    case "HellenicCraftsmen":
      return "hellenic-craftsmen"
    case "OracleOfDelphi":
      return "oracle"
    case "TempleOfAthena":
      return "temple-of-athena"
    case "TempleOfPoseidon":
      return "temple-of-poseidon"
    case "TempleOfZeus":
      return "temple-of-zeus"
    case "PoliticalReforms":
      return "political-reforms"
    case "AgeanSea":
      return "agean-sea"
    case "IonianSea":
      return "ionian-sea"
    case "Hellespont":
      return "hellespont"
    case "Forage":
      return "forage"
    case "Psiloi":
      return "psiloi"
    case "DemocraticFaction":
      return "democratic-faction"
    case "TheSenate":
      return "the-senate"
    case "TheFiveEphors":
      return "the-five-ephors"
    case "TheTenStrategoi":
      return "the-ten-strategoi"
    case "Provisions":
      return "provisions"
    case "SupplyCache":
      return "supply-cache"
    case "PersianSupport":
      return "persian-support"
    case "MilitaryTraining":
      return "military-training"
    case "MilitaryLogistics":
      return "military-logistics"
    case "MilitaryReforms":
      return "military-reforms"
    case "ThraticanTactics":
      return "thratican-tactics"
    case "OligarchicFaction":
      return "oligarchic-faction"
    case "VillageGranary":
      return "village-granary"
    case "WarSpoils":
      return "war-spoils"
  }
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
    case "Hoplite":
    case "AuxiliaryTroops":
    case "Phalanx":
    case "OrganizedDeploy":
    case "MilitaryMobilization":
    case "Polis":
    case "Koinas":
    case "HellenicCraftsmen":
    case "PoliticalReforms":
    case "DemocraticFaction":
    case "OracleOfDelphi":
    case "TempleOfZeus":
    case "TempleOfPoseidon":
    case "TempleOfAthena":
    case "AgeanSea":
    case "IonianSea":
    case "Hellespont":
    case "Forage":
    case "Psiloi":
    case "TheSenate":
    case "TheFiveEphors":
    case "TheTenStrategoi":
    case "Provisions":
    case "SupplyCache":
    case "PersianSupport":
    case "MilitaryTraining":
    case "MilitaryLogistics":
    case "MilitaryReforms":
    case "ThraticanTactics":
    case "OligarchicFaction":
    case "VillageGranary":
    case "WarSpoils":
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
    case "Hoplite":
      return "Deploy Hoplite"
    case "Polis":
      return "Polis"
    case "Koinas":
      return "Koinas"
    case "HellenicCraftsmen":
      return "Hellenic Craftsmen"
    case "OracleOfDelphi":
      return "Oracle of Delphi"
    case "TempleOfAthena":
      return "Temple of Athena"
    case "TempleOfPoseidon":
      return "Temple of Poseidon"
    case "TempleOfZeus":
      return "Temple of Zeus"
    case "PoliticalReforms":
      return "Political Reforms"
    case "OrganizedDeploy":
      return "Orgainzed Deploy"
    case "MilitaryMobilization":
      return "Miliatry Mobilization"
    case "AuxiliaryTroops":
      return "Auxiliary Troops"
    case "DemocraticFaction":
      return "Democratic Faction"
    case "Phalanx":
      return "Phalanx"
    case "AgeanSea":
      return "Agean Sea"
    case "IonianSea":
      return "Ionian Sea"
    case "Hellespont":
      return "Hellespont"
    case "Forage":
      return "Forage"
    case "Psiloi":
      return "Psiloi"
    case "TheSenate":
      return "The Senate"
    case "TheFiveEphors":
      return "The Five Ephors"
    case "TheTenStrategoi":
      return "The Ten Strategoi"
    case "Provisions":
      return "Provisions"
    case "SupplyCache":
      return "Supply Cache"
    case "PersianSupport":
      return "Persian Support"
    case "MilitaryTraining":
      return "Military Training"
    case "MilitaryLogistics":
      return "Military Logistics"
    case "MilitaryReforms":
      return "Military Reforms"
    case "ThraticanTactics":
      return "Thratican Tactics"
    case "OligarchicFaction":
      return "Oligarchic Faction"
    case "VillageGranary":
      return "Village Granary"
    case "WarSpoils":
      return "War Spoils"
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
    case "Hoplite":
    case "PoliticalReforms":
    case "DemocraticFaction":
    case "HellenicCraftsmen":
    case "OracleOfDelphi":
    case "TempleOfAthena":
    case "TempleOfPoseidon":
    case "TempleOfZeus":
    case "OrganizedDeploy":
    case "MilitaryMobilization":
    case "AuxiliaryTroops":
    case "Phalanx":
    case "Koinas":
    case "AgeanSea":
    case "IonianSea":
    case "Hellespont":
    case "Forage":
    case "Psiloi":
    case "TheSenate":
    case "TheFiveEphors":
    case "TheTenStrategoi":
    case "Provisions":
    case "SupplyCache":
    case "PersianSupport":
    case "MilitaryTraining":
    case "MilitaryLogistics":
    case "MilitaryReforms":
    case "ThraticanTactics":
    case "OligarchicFaction":
    case "VillageGranary":
    case "WarSpoils":
      return ""
    case "Polis":
      return "A political concept which encompasses the entire territory and citizen body of a city-state"
  }
}

export const toDescription = (card: Card): string => {
  if (isStrategy(card)) {
    return ""
  }
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
  }
}

export const toPlayCost = (card: Card): PlayCost => {
  switch (toKind(card)) {
    case "Strategy":
      return [1, 0, 0]
    case "Tactic":
      return [0, 1, 0]
  }
}

export const toPlayValue = (card: Card): PlayValue => {
  if (isTactic(card)) {
    return PointsPool.empty
  }

  switch (card) {
    case "Hoplite":
      return PointsPool.build({ hoplPts: 1 })
    case "AuxiliaryTroops":
      return PointsPool.build({ hoplPts: 2 })
    case "Phalanx":
      return PointsPool.build({ hoplPts: 5 })
    case "OrganizedDeploy":
      return PointsPool.build({ strtPts: 1, hoplPts: 1 })
    case "MilitaryMobilization":
      return PointsPool.build({ strtPts: 1, hoplPts: 2 })
    case "Polis":
      return PointsPool.build({ drawPts: 1, strtPts: 2 })
    case "Koinas":
      return PointsPool.build({ drawPts: 2, strtPts: 3 })
    case "HellenicCraftsmen":
      return PointsPool.build({ drawPts: 3 })
    case "OracleOfDelphi":
      return PointsPool.build({
        strtPts: 1,
        tactPts: 1,
        drawPts: 3,
        rescPts: 1,
      })
    case "TempleOfZeus":
      return PointsPool.build({
        strtPts: 1,
        tactPts: 2,
        drawPts: 2,
        rescPts: 2,
      })
    case "TempleOfPoseidon":
      return PointsPool.build({
        strtPts: 1,
        tactPts: 1,
        drawPts: 1,
        rescPts: 5,
      })
    case "TempleOfAthena":
      return PointsPool.build({
        strtPts: 1,
        tactPts: 3,
        drawPts: 1,
        rescPts: 1,
      })
    case "PoliticalReforms":
      return PointsPool.build({ strtPts: 2 })
    case "DemocraticFaction":
      return PointsPool.build({ strtPts: 4 })
    case "AgeanSea":
      return PointsPool.build({ strtPts: 1, rescPts: 3 })
    case "IonianSea":
      return PointsPool.build({ strtPts: 1, rescPts: 5 })
    case "Hellespont":
      return PointsPool.build({ strtPts: 1, rescPts: 7 })
    case "Forage":
      return PointsPool.build({ tactPts: 1, drawPts: 1 })
    case "Psiloi":
      return PointsPool.build({ tactPts: 3, drawPts: 1 })
    case "TheSenate":
      return PointsPool.build({ tactPts: 3, strtPts: 2 })
    case "TheFiveEphors":
      return PointsPool.build({ tactPts: 5, strtPts: 1 })
    case "TheTenStrategoi":
      return PointsPool.build({ tactPts: 3, strtPts: 1 })
    case "Provisions":
      return PointsPool.build({ tactPts: 1 })
    case "SupplyCache":
      return PointsPool.build({ tactPts: 1 })
    case "PersianSupport":
      return PointsPool.build({ tactPts: 1 })
    case "MilitaryTraining":
      return PointsPool.build({ tactPts: 2 })
    case "MilitaryLogistics":
      return PointsPool.build({ tactPts: 3 })
    case "MilitaryReforms":
      return PointsPool.build({ tactPts: 4 })
    case "ThraticanTactics":
      return PointsPool.build({ tactPts: 5 })
    case "OligarchicFaction":
      return PointsPool.build({ tactPts: 6 })
    case "VillageGranary":
      return PointsPool.build({ rescPts: 3 })
    case "WarSpoils":
      return PointsPool.build({ rescPts: 7 })
  }
}

// hopl -> 2
// strt -> 1
// tact -> 0.5
// resc -> 1
// draw -> 2

export const toResourceCost = (card: Card): ResourceCost => {
  switch (card) {
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
    case "Provisions":
      return 0
    case "AssaultLeft":
    case "AssaultRight":
    case "AssaultForward":
    case "MilitaryTraining":
      return 1
    case "Hoplite":
    case "PoliticalReforms":
      return 2
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
    case "OrganizedDeploy":
    case "AgeanSea":
    case "Polis":
    case "SupplyCache":
    case "MilitaryLogistics":
    case "VillageGranary":
      return 3
    case "Psiloi":
      return 4
    case "IonianSea":
    case "MilitaryMobilization":
    case "AuxiliaryTroops":
    case "Koinas":
    case "HellenicCraftsmen":
    case "MilitaryReforms":
    case "OracleOfDelphi":
    case "TempleOfAthena":
    case "TempleOfPoseidon":
    case "TempleOfZeus":
    case "TheSenate":
    case "TheFiveEphors":
    case "TheTenStrategoi":
    case "ThraticanTactics":
      return 5
    case "Phalanx":
    case "Forage":
    case "WarSpoils":
      return 6
    case "OligarchicFaction":
    case "DemocraticFaction":
    case "Hellespont":
      return 7
    case "PersianSupport":
      return 9
  }
}

type ResourceValue = number
export const toResourceValue = (card: Card): ResourceValue => {
  switch (card) {
    case "OracleOfDelphi":
    case "TempleOfZeus":
    case "TempleOfPoseidon":
    case "TempleOfAthena":
    case "AgeanSea":
    case "IonianSea":
    case "Hellespont":
      return 0
    case "ManeuverLeft":
    case "ManeuverRight":
    case "ManeuverForward":
    case "AssaultLeft":
    case "AssaultRight":
    case "AssaultForward":
    case "Charge":
    case "FlankLeft":
    case "FlankRight":
    case "Hoplite":
    case "Forage":
    case "Psiloi":
    case "TheSenate":
    case "TheFiveEphors":
    case "TheTenStrategoi":
    case "Provisions":
    case "MilitaryTraining":
    case "MilitaryLogistics":
    case "ThraticanTactics":
    case "OligarchicFaction":
    case "VillageGranary":
    case "WarSpoils":
    case "DemocraticFaction":
    case "OrganizedDeploy":
    case "MilitaryMobilization":
    case "MilitaryReforms":
    case "PoliticalReforms":
      return 1
    case "AuxiliaryTroops":
    case "HellenicCraftsmen":
      return 2
    case "Phalanx":
    case "Polis":
      return 3
    case "Koinas":
    case "SupplyCache":
      return 4
    case "PersianSupport":
      return 7
  }
}
