import { Array, Effect, pipe, Random, Record } from "effect"

import { Card, Hand } from "./deck"
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

export const randomizeSupplyPiles = (gameSetup: GameSetup): GameSetup => {
  const s = Effect.gen(function* (_) {
    const { supplyPiles } = gameSetup

    const keys = pipe(supplyPiles, Record.keys)
    const shuffled = yield* _(Random.shuffle(keys))

    const nextSupplyKeys = pipe(shuffled, Array.take(10))

    const nextSupplyPiles = pipe(
      nextSupplyKeys,
      Array.reduce<Supply.CheckedSupplyPiles, Card.Card>(
        Supply.allUnchecked(),
        (acc, card) => {
          acc[card] = true
          return acc
        },
      ),
    )

    return { ...gameSetup, supplyPiles: nextSupplyPiles }
  })

  const result = Effect.runSync(s)

  return result
}
