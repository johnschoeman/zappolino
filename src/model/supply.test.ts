import { expect, test } from "bun:test"
import { pipe } from "effect"

import * as Cards from "./deck/cards"
import * as SupplySetup from "./gameSetup/supplySetup"
import * as Supply from "./supply"

test("Supply.build", () => {
  const checkedSupplyPiles: SupplySetup.SupplySetup = pipe(
    Cards.empty,
    Cards.map(() => false),
    cards => {
      const tactic = cards.cardsTactic
      return { ...cards, cardsTactic: { ...tactic, ManeuverLeft: true } }
    },
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
