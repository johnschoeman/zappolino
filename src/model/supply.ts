import { Array, pipe, Record } from "effect"

import { Card, Cards } from "./deck"

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

export const build = (checkedSupplyPiles: CheckedSupplyPiles): Supply => {
  return pipe(
    checkedSupplyPiles,
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
}

export type CheckedSupplyPiles = Cards.Cards<boolean>

export const allChecked = (): CheckedSupplyPiles => {
  return pipe(
    Cards.empty,
    Record.map(() => true),
  )
}

export const allUnchecked = (): CheckedSupplyPiles => {
  const result = pipe(
    Cards.empty,
    Record.map(() => false),
  )
  return result
}

export const initialCheckedSupplyPiles: CheckedSupplyPiles = allChecked()
