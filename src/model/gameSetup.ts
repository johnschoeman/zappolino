import { Hand } from "./deck"
import * as Supply from "./supply"

export type GameSetup = {
  handCount: Hand.HandCount
  supplyPiles: Supply.CheckedSupplyPiles
}

export const initial: GameSetup = {
  handCount: Hand.initialHandCount,
  supplyPiles: Supply.initialCheckedSupplyPiles,
}
