import { Array, pipe, Record } from "effect"

import * as Card from "./card"
import * as Cards from "./cards"

const DEFAULT_HAND_SIZE = 5

// ---- Hand

export type Hand = Card.Card[]

export const defaultInitialHand: Hand = [
  "Hoplite",
  "Hoplite",
  "ManeuverLeft",
  "ManeuverRight",
  "ManeuverForward",
]

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

// ---- HandCount

export type HandCount = Record<Card.Card, number>
const emptyHandCount: HandCount = pipe(
  Cards.empty,
  Record.map(() => 0),
)

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
  Hoplite: 2,
  ManeuverForward: 1,
  ManeuverLeft: 1,
  ManeuverRight: 1,
})

// ---- HandSize

export type HandSize = number

export const initialHandSize = DEFAULT_HAND_SIZE
