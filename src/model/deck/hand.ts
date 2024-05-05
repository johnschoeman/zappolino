import { Array, pipe } from "effect"

import * as HandSetup from "../gameSetup/handSetup"

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

export const build = (handSetup: HandSetup.HandSetup): Hand => {
  return pipe(
    handSetup,
    Cards.toEntries,
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

// ---- HandSize

export type HandSize = number

export const initialHandSize = DEFAULT_HAND_SIZE
