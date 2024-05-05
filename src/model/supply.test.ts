import { expect, test } from "bun:test"
import { pipe, Record } from "effect"

import * as Cards from "./deck/cards"
import * as Supply from "./supply"

test("Supply.build", () => {
  const checkedSupplyPiles: Supply.CheckedSupplyPiles = pipe(
    Cards.empty,
    Record.map(() => false),
    cards => ({ ...cards, ManeuverLeft: true }),
  )

  const result = Supply.build(checkedSupplyPiles)

  const expected: Supply.Supply = [
    {
      card: "ManeuverLeft",
      count: Supply.SUPPLY_SIZE,
    },
  ]

  expect(result).toEqual(expected)
})
