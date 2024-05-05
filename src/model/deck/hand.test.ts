import { expect, test } from "bun:test"

import * as Hand from "./hand"

test("Hand.build", () => {
  const handCount: Hand.HandCount = Hand.handCountFromPartial({
    Hoplite: 1,
  })

  const result = Hand.build(handCount)

  const expected: Hand.Hand = ["Hoplite"]

  expect(result).toEqual(expected)
})
