import { Hand } from "../deck"

import * as HandSetup from "./handSetup"
import * as SupplySetup from "./supplySetup"

export type GameSetup = {
  startingHandSize: number
  handSetupTactic: HandSetup.HandSetupTactic
  handSetupStrategy: HandSetup.HandSetupStrategy
  supplySetupTactic: SupplySetup.SupplySetupTactic
  supplySetupStrategy: SupplySetup.SupplySetupStrategy
}

export const initial: GameSetup = {
  startingHandSize: Hand.initialHandSize,
  handSetupTactic: HandSetup.initialTactic,
  handSetupStrategy: HandSetup.initialStrategy,
  supplySetupTactic: SupplySetup.initialTacticSetup,
  supplySetupStrategy: SupplySetup.initialStrategySetup,
}

export const randomizeSupplySetupTactic = (gameSetup: GameSetup): GameSetup => {
  const next = SupplySetup.randomizeTactic(6)
  return {
    ...gameSetup,
    supplySetupTactic: next,
  }
}

export const randomizeSupplySetupStrategy = (
  gameSetup: GameSetup,
): GameSetup => {
  const next = SupplySetup.randomizeStrategy(6)
  return {
    ...gameSetup,
    supplySetupStrategy: next,
  }
}
