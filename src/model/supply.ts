import { Array, pipe, Record } from "effect"

import { Card } from "./deck"
import { SupplySetup } from "./gameSetup"

export const SUPPLY_SIZE = 8

export type Supply = SupplyPile[]

export type SupplyPile = {
  card: Card.Card
  count: number
}

const buildPile = (card: Card.Card): SupplyPile => {
  return {
    card,
    count: SUPPLY_SIZE,
  }
}

export const initial: Supply = pipe(Card.all, Array.map(buildPile))

export const build = (supplySetup: SupplySetup.SupplySetup): Supply => {
  const { cardsTactic, cardsStrategy } = supplySetup

  const strategy = pipe(
    cardsStrategy,
    Record.toEntries,
    Array.reduce<Supply, [Card.Card, boolean]>(
      [],
      (acc, [card, isIncluded]) => {
        if (isIncluded) {
          return Array.append(buildPile(card))(acc)
        } else {
          return acc
        }
      },
    ),
  )

  const tactics = pipe(
    cardsTactic,
    Record.toEntries,
    Array.reduce<Supply, [Card.Card, boolean]>(
      [],
      (acc, [card, isIncluded]) => {
        if (isIncluded) {
          return Array.append(buildPile(card))(acc)
        } else {
          return acc
        }
      },
    ),
  )

  return [...tactics, ...strategy]
}
