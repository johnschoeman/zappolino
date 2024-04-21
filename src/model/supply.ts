import { Array, pipe } from "effect"

import { Card } from "./deck"

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
