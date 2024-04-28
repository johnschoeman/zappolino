import { Hand } from "./deck"
import * as Supply from "./supply"

export type GameSetup = {
  handCount: Hand.HandCount
  startingHandSize: number
  supplyPiles: Supply.CheckedSupplyPiles
}

export const initial: GameSetup = {
  handCount: Hand.initialHandCount,
  startingHandSize: Hand.initialHandSize,
  supplyPiles: Supply.initialCheckedSupplyPiles,
}
