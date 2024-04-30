import { Array, pipe, Record } from "effect"

import * as Card from "./card"

export type Hand = Card.Card[]

export const defaultInitialHand: Hand = [
  "DeployHoplite",
  "DeployHoplite",
  "ManeuverLeft",
  "ManeuverRight",
  "ManeuverForward",
]

export type HandCount = Record<Card.Card, number>
const emptyHandCount: HandCount = {
  ManeuverLeft: 0,
  ManeuverRight: 0,
  ManeuverForward: 0,
  AssaultLeft: 0,
  AssaultRight: 0,
  AssaultForward: 0,
  Charge: 0,
  FlankLeft: 0,
  FlankRight: 0,
  DeployHoplite: 0,
  Polis: 0,
  MilitaryReforms: 0,
  PoliticalReforms: 0,
  Oracle: 0,
}

type PartialHandCount = Partial<HandCount>

export const handCountFromPartial = (
  partialHandCount: PartialHandCount,
): HandCount => {
  return {
    ...emptyHandCount,
    ...partialHandCount,
  }
}

export const initialHandCount: HandCount = handCountFromPartial({
  DeployHoplite: 2,
  ManeuverForward: 1,
  ManeuverLeft: 1,
  ManeuverRight: 1,
})

export const build = (handCount: HandCount): Hand => {
  return pipe(
    handCount,
    Record.toEntries,
    Array.reduce<Hand, [Card.Card, number]>([], (acc, [card, count]) => {
      if (count > 0) {
        const nextCards: Hand = Array.replicate(count)(card)
        const result: Hand = Array.appendAll(acc, nextCards)
        return result
      } else {
        return acc
      }
    }),
  )
}
