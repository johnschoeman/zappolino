import { expect, test } from "bun:test"

import * as Supply from "./supply"

test("Supply.build", () => {
  const checkedSupplyPiles: Supply.CheckedSupplyPiles = {
    ManeuverLeft: true,
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

  const result = Supply.build(checkedSupplyPiles)

  const expected: Supply.Supply = [
    {
      card: "ManeuverLeft",
      count: Supply.SUPPLY_SIZE,
    },
  ]

  expect(result).toEqual(expected)
})
