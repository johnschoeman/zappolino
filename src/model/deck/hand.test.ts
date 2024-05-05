import { expect, test } from "bun:test"

import * as HandSetup from "../gameSetup/handSetup"

import * as Cards from "./cards"
import * as Hand from "./hand"

test("Hand.build", () => {
  const handCount: HandSetup.HandSetup = Cards.fromPartial(() => 0)({
    cardsStrategy: {
      Hoplite: 1,
    },
    cardsTactic: {},
  })

  const result = Hand.build(handCount)

  const expected: Hand.Hand = ["Hoplite"]

  expect(result).toEqual(expected)
})
