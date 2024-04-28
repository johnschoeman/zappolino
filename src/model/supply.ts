import { Array, pipe, Record } from "effect"

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

export type CheckedSupplyPiles = Record<Card.Card, boolean>

export const initialCheckedSupplyPiles: CheckedSupplyPiles = {
  ManeuverLeft: true,
  ManeuverRight: true,
  ManeuverForward: true,
  AssaultLeft: true,
  AssaultRight: true,
  AssaultForward: true,
  Charge: true,
  FlankLeft: true,
  FlankRight: true,
  DeployHoplite: true,
  CityState: true,
  MilitaryReforms: true,
  PoliticalReforms: true,
  Oracle: true,
}

export const allChecked: CheckedSupplyPiles = {
  ManeuverLeft: true,
  ManeuverRight: true,
  ManeuverForward: true,
  AssaultLeft: true,
  AssaultRight: true,
  AssaultForward: true,
  Charge: true,
  FlankLeft: true,
  FlankRight: true,
  DeployHoplite: true,
  CityState: true,
  MilitaryReforms: true,
  PoliticalReforms: true,
  Oracle: true,
}

export const allUnchecked: CheckedSupplyPiles = {
  ManeuverLeft: false,
  ManeuverRight: false,
  ManeuverForward: false,
  AssaultLeft: false,
  AssaultRight: false,
  AssaultForward: false,
  Charge: false,
  FlankLeft: false,
  FlankRight: false,
  DeployHoplite: false,
  CityState: false,
  MilitaryReforms: false,
  PoliticalReforms: false,
  Oracle: false,
}
