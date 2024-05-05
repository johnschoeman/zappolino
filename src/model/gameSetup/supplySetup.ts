import { pipe } from "effect"

import { Cards } from "../deck"

export type SupplySetup = Cards.Cards<boolean>

export type SupplySetupTactic = Cards.CardsTactic<boolean>
export type SupplySetupStrategy = Cards.CardsStrategy<boolean>

export const allCheckedTactic = (): SupplySetupTactic => {
  return pipe(
    Cards.emptyTactics,
    Cards.mapTactics(() => true),
  )
}

export const allCheckedStrategy = (): SupplySetupStrategy => {
  return pipe(
    Cards.emptyStrategy,
    Cards.mapStrategy(() => true),
  )
}

export const allUncheckedTactic = (): SupplySetupTactic => {
  return pipe(
    Cards.emptyTactics,
    Cards.mapTactics(() => false),
  )
}

export const allUncheckedStrategy = (): SupplySetupStrategy => {
  return pipe(
    Cards.emptyStrategy,
    Cards.mapStrategy(() => false),
  )
}

export const randomizeTactic = (count: number): SupplySetupTactic => {
  return Cards.randomizeTactic(() => true)(count)(allUncheckedTactic())
}

export const randomizeStrategy = (count: number): SupplySetupStrategy => {
  return Cards.randomizeStrategy(() => true)(count)(allUncheckedStrategy())
}

export const initialTacticSetup: SupplySetupTactic = allCheckedTactic()
export const initialStrategySetup: SupplySetupStrategy = allCheckedStrategy()
