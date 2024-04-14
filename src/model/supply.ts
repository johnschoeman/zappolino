import { Card } from "./deck"

const SUPPLY_SIZE = 8

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

export const initial: Supply = [
  buildPile("Place"),
  buildPile("MoveLeft"),
  buildPile("MoveRight"),
  buildPile("MoveForward"),
  buildPile("Charge"),
  buildPile("Flank"),
  buildPile("MilitaryReforms"),
  buildPile("PoliticalReforms"),
]
