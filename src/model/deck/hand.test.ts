import { expect, test } from "bun:test"

import * as Hand from "./hand"

test("Hand.build", () => {
  const handCount: Hand.HandCount = Hand.handCountFromPartial({
    DeployHoplite: 1,
  })

  const result = Hand.build(handCount)

  const expected: Hand.Hand = ["DeployHoplite"]

  expect(result).toEqual(expected)
})
