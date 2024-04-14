import { Factory } from "fishery"

import { Supply } from "../src/model"

export const supplyFactory = Factory.define<Supply.Supply>(() => {
  const supply: Supply.Supply = [
    { card: "Place", count: 8 },
    { card: "MoveLeft", count: 8 },
    { card: "MoveRight", count: 8 },
    { card: "MoveForward", count: 8 },
    { card: "Charge", count: 8 },
    { card: "Flank", count: 8 },
    { card: "MilitaryReforms", count: 8 },
    { card: "PoliticalReforms", count: 8 },
  ]

  return supply
})
